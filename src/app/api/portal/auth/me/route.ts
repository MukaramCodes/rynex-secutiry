import { NextResponse } from "next/server";
import { getSession } from "@/lib/portal/auth";
import prisma from "@/lib/portal/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        allowedIp: true,
        isActive: true,
        mustChangePassword: true,
        lastLogin: true,
        teamId: true,
        createdAt: true,
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("[Portal Auth] Me error:", error);
    return NextResponse.json(
      { error: "An error occurred." },
      { status: 500 }
    );
  }
}
