import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendTeamNotification, sendEventRegistrationEmail } from "@/lib/mailer";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, category, organization, experience } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone number are required." },
        { status: 400 }
      );
    }

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const ticketToken = `RYNEX-ECLIPSE-2026-${randomNum}`;

    // Save submission to DB
    const submission = await prisma.eventSubmission.create({
      data: {
        type: "COMPETITOR",
        eventName: "Rynex Eclipse 2026",
        ticketToken,
        name,
        email: email.toLowerCase().trim(),
        phone,
        groupName: organization || "Individual",
        category: category || "University Student",
        experience: experience || "Beginner",
        status: "PENDING",
      },
    });

    // Send internal team notification to Rynex Mail
    await sendTeamNotification(
      `🎯 NEW CTF REGISTRATION: ${name} (${organization || "Individual"}) — ${ticketToken}`,
      `
        <h2>New Competitor Registration for Rynex Eclipse 2026</h2>
        <p><strong>Ticket Token:</strong> ${ticketToken}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Group / Team / University:</strong> ${organization || "Individual"}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Registration Fee:</strong> PKR 500</p>
      `,
      email
    );

    // Send ticket confirmation email to the applicant
    await sendEventRegistrationEmail({
      to: email,
      name,
      ticketToken,
      groupName: organization || "Individual",
      category,
    });

    return NextResponse.json({
      ok: true,
      ticketToken,
      id: submission.id,
    });
  } catch (error: any) {
    console.error("[api/events/register] Error processing registration:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
