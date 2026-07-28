import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendTeamNotification, sendConfirmationEmail } from "@/lib/mailer";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { companyName, contactName, email, phone, tier, message } = body;

    if (!companyName || !contactName || !email || !phone) {
      return NextResponse.json(
        { error: "Company name, contact name, email, and phone are required." },
        { status: 400 }
      );
    }

    // Save sponsorship inquiry to DB
    const submission = await prisma.eventSubmission.create({
      data: {
        type: "SPONSOR",
        eventName: "Rynex Eclipse 2026",
        name: contactName,
        email: email.toLowerCase().trim(),
        phone,
        groupName: companyName,
        tier: tier || "Title Sponsor",
        message: message || null,
        status: "PENDING",
      },
    });

    // Send internal team notification to Rynex Mail
    await sendTeamNotification(
      `🤝 NEW EVENT SPONSORSHIP INQUIRY: ${companyName} (${tier || "Title Sponsor"})`,
      `
        <h2>New Sponsorship Proposal Inquiry — Rynex Eclipse 2026</h2>
        <p><strong>Organization / Company:</strong> ${companyName}</p>
        <p><strong>Contact Person:</strong> ${contactName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Selected Tier:</strong> ${tier}</p>
        <p><strong>Message / Notes:</strong></p>
        <p>${message ? message.replace(/\r?\n/g, "<br/>") : "None"}</p>
      `,
      email
    );

    // Send confirmation email to sponsor
    await sendConfirmationEmail(
      email,
      `Rynex Eclipse 2026 — Sponsorship Proposal Confirmation`,
      `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #00d4ff;">Rynex Security — Sponsorship Inquiry Received</h2>
          <p>Dear <strong>${contactName}</strong>,</p>
          <p>Thank you for expressing interest in partnering with <strong>Rynex Eclipse 2026</strong> as a <strong>${tier}</strong> representing <strong>${companyName}</strong>.</p>
          <p>Our team will review your inquiry and contact you within 24 hours to discuss partnership details and share the complete sponsorship deck.</p>
          <p>Best regards,<br/><strong>Rynex Security Event Team</strong><br/>info@rynexsecurity.com</p>
        </div>
      `
    );

    return NextResponse.json({
      ok: true,
      id: submission.id,
    });
  } catch (error: any) {
    console.error("[api/events/sponsor] Error processing sponsorship inquiry:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
