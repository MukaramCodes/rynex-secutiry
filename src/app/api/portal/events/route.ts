import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all event submissions for Admin Portal
export async function GET(req: Request) {
  try {
    const submissions = await prisma.eventSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("[api/portal/events] GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch event submissions" }, { status: 500 });
  }
}

// PATCH update status of submission (e.g., PENDING -> CONTACTED / CONFIRMED / CANCELLED)
export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
    }

    const updated = await prisma.eventSubmission.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ ok: true, submission: updated });
  } catch (error) {
    console.error("[api/portal/events] PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update submission" }, { status: 500 });
  }
}

// DELETE submission
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.eventSubmission.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/portal/events] DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete submission" }, { status: 500 });
  }
}
