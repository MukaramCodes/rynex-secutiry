import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/portal/prisma";
import { getSession } from "@/lib/portal/auth";
import { canDeleteUser, hasPermission } from "@/lib/portal/permissions";
import { Role } from "@prisma/client";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id },
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
        originalEmail: true,
        joiningDate: true,
        probationStart: true,
        probationEnd: true,
        team: { select: { id: true, name: true } },
        projectMembers: {
          select: {
            project: { select: { id: true, title: true, status: true } },
            memberRole: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("[Users API] GET [id] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const actorRole = session.role as Role;

    if (!hasPermission(actorRole, "manage_all_users") && session.userId !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, teamId, isActive, role, resetPassword, originalEmail, joiningDate, probationStart, probationEnd } = body;

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name.trim();
    if (email !== undefined) updateData.email = email.toLowerCase().trim();
    if (teamId !== undefined) updateData.teamId = teamId || null;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Only CEO/Admin/Developer can change roles
    if (role !== undefined && ["CEO", "ADMIN", "DEVELOPER"].includes(actorRole)) {
      updateData.role = role;
    }

    if (originalEmail !== undefined) {
      updateData.originalEmail = originalEmail || null;
    }

    if (joiningDate !== undefined) {
      updateData.joiningDate = joiningDate ? new Date(joiningDate) : null;
    }

    if (probationStart !== undefined) {
      updateData.probationStart = probationStart ? new Date(probationStart) : null;
    }

    if (probationEnd !== undefined) {
      updateData.probationEnd = probationEnd ? new Date(probationEnd) : null;
    }

    let tempPassword: string | undefined;
    if (resetPassword && hasPermission(actorRole, "manage_all_users")) {
      tempPassword = generateTempPassword();
      updateData.passwordHash = await bcrypt.hash(tempPassword, 12);
      updateData.mustChangePassword = true;
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true, name: true, email: true, role: true, isActive: true, teamId: true,
      },
    });

    // Audit
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "USER_UPDATED",
        entityType: "USER",
        entityId: id,
        details: `Updated user ${user.email}`,
      },
    });

    return NextResponse.json({ user, ...(tempPassword ? { tempPassword } : {}) });
  } catch (error) {
    console.error("[Users API] PATCH error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const actorRole = session.role as Role;

    if (!canDeleteUser(actorRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (id === session.userId) {
      return NextResponse.json(
        { error: "You cannot delete your own account." },
        { status: 400 }
      );
    }

    // Soft delete — just deactivate
    await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "USER_DEACTIVATED",
        entityType: "USER",
        entityId: id,
        details: "User account deactivated",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Users API] DELETE error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function generateTempPassword(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$!";
  let pw = "";
  for (let i = 0; i < 12; i++) pw += chars[Math.floor(Math.random() * chars.length)];
  return pw;
}
