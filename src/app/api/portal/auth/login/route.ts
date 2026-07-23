import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/portal/prisma";
import { signJWT, createSessionCookie } from "@/lib/portal/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // IP Access Control Check
    const forwarded = req.headers.get("x-forwarded-for");
    const clientIp = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
    const isAdmin = ["ADMIN", "CEO"].includes(user.role);

    const allowedIp = user.allowedIp ? user.allowedIp.trim() : "192.168.1.17";
    const normalizedClient = clientIp.trim();

    if (!isAdmin && allowedIp !== normalizedClient) {
      // Check if there's already a pending request from this IP
      const existingRequest = await prisma.loginRequest.findFirst({
        where: {
          userId: user.id,
          requestedIp: normalizedClient,
          status: "PENDING",
        },
      });

      if (!existingRequest) {
        await prisma.loginRequest.create({
          data: {
            userId: user.id,
            requestedIp: normalizedClient,
            currentAllowedIp: allowedIp,
            status: "PENDING",
          },
        });

        // Notify all ADMIN and CEO users
        const admins = await prisma.user.findMany({
          where: { role: { in: ["ADMIN", "CEO"] }, isActive: true },
          select: { id: true },
        });

        await prisma.notification.createMany({
          data: admins.map((admin) => ({
            userId: admin.id,
            title: "🚨 Unauthorized Login Attempt",
            body: `${user.name} (${user.email}) attempted to login from IP ${normalizedClient}. Authorized IP is ${allowedIp}. Please review in Access Control.`,
            link: "/portal/access-control",
          })),
        });
      }

      return NextResponse.json(
        {
          error: "IP_NOT_AUTHORIZED",
          message: "Login from this IP address is not authorized. Your administrator has been notified.",
          requestedIp: normalizedClient,
        },
        { status: 403 }
      );
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Create JWT
    const token = await signJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      mustChangePassword: user.mustChangePassword,
    });

    // Log audit event
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "LOGIN",
        entityType: "USER",
        entityId: user.id,
        details: "User logged in",
        ipAddress: req.headers.get("x-forwarded-for") ?? "unknown",
      },
    });

    const response = NextResponse.json({
      success: true,
      mustChangePassword: user.mustChangePassword,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    const cookie = createSessionCookie(token);
    response.cookies.set(cookie);

    return response;
  } catch (error) {
    console.error("[Portal Auth] Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
