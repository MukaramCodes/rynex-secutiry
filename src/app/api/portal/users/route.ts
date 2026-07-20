import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/portal/prisma";
import { getSession } from "@/lib/portal/auth";
import { canCreateRole, hasPermission } from "@/lib/portal/permissions";
import { Role } from "@prisma/client";
import { sendWelcomeEmail } from "@/lib/portal/mailer";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = session.role as Role;
    let users;

    if (["CEO", "ADMIN", "DEVELOPER"].includes(role)) {
      // Full access — see all users
      users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          teamId: true,
          lastLogin: true,
          createdAt: true,
          mustChangePassword: true,
          team: { select: { id: true, name: true } },
          originalEmail: true,
          joiningDate: true,
          probationStart: true,
          probationEnd: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } else if (role === "HEAD") {
      // Heads can only see their team members
      const head = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { teamId: true },
      });

      users = await prisma.user.findMany({
        where: { teamId: head?.teamId ?? undefined },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          teamId: true,
          lastLogin: true,
          createdAt: true,
          mustChangePassword: true,
          team: { select: { id: true, name: true } },
          originalEmail: true,
          joiningDate: true,
          probationStart: true,
          probationEnd: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ users });
  } catch (error) {
    console.error("[Users API] GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const actorRole = session.role as Role;

    if (!hasPermission(actorRole, "create_users")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, email, role, teamId, tempPassword, originalEmail, joiningDate, probationStart, probationEnd } = await req.json();

    if (!name || !email || !role) {
      return NextResponse.json(
        { error: "Name, email, and role are required." },
        { status: 400 }
      );
    }

    const targetRole = role as Role;

    // Check role creation permissions
    if (!canCreateRole(actorRole, targetRole)) {
      return NextResponse.json(
        { error: `You cannot create a user with role ${role}.` },
        { status: 403 }
      );
    }

    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A user with this email already exists." },
        { status: 409 }
      );
    }

    // Generate or use provided password
    const password = tempPassword || generateTempPassword();
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        role: targetRole,
        teamId: teamId || null,
        isActive: true,
        mustChangePassword: true,
        createdById: session.userId,
        originalEmail: originalEmail || null,
        joiningDate: joiningDate ? new Date(joiningDate) : null,
        probationStart: probationStart ? new Date(probationStart) : null,
        probationEnd: probationEnd ? new Date(probationEnd) : null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        teamId: true,
        createdAt: true,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "USER_CREATED",
        entityType: "USER",
        entityId: user.id,
        details: `Created user ${user.email} with role ${user.role}`,
      },
    });

    // Send welcome email with credentials
    const portalUrl = process.env.PORTAL_URL ?? `${process.env.SITE_URL}/portal/login`;
    try {
      await sendWelcomeEmail({
        to: originalEmail || user.email,
        name: user.name,
        role: user.role,
        email: user.email,
        tempPassword: password,
        portalUrl,
      });
    } catch (emailErr) {
      console.error("[Users API] Welcome email failed:", emailErr);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ user, tempPassword: password }, { status: 201 });
  } catch (error) {
    console.error("[Users API] POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function generateTempPassword(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$!";
  let pw = "";
  for (let i = 0; i < 12; i++) {
    pw += chars[Math.floor(Math.random() * chars.length)];
  }
  return pw;
}
