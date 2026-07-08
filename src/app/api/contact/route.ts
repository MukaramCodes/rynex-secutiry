import { NextResponse } from "next/server";
import { sendTeamNotification, sendConfirmationEmail } from "@/lib/mailer";

const INQUIRY_LABELS: Record<string, string> = {
  general: "General Inquiry",
  consultation: "Security Consultation (VAPT / SOC / GRC)",
  partnership: "Strategic Partnership",
  careers: "Careers / Internship",
  media: "Media & Press",
};

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, inquiryType, subject, message, website } = body;

  // Honeypot: bots fill hidden fields, humans don't.
  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }

  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  const inquiryLabel = INQUIRY_LABELS[inquiryType] ?? "General Inquiry";

  try {
    await sendTeamNotification(
      `New contact form message from ${name} — ${inquiryLabel}${subject ? ` — ${subject}` : ""}`,
      `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Inquiry Type:</strong> ${escapeHtml(inquiryLabel)}</p>
        ${subject ? `<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
      `,
      email
    );

    await sendConfirmationEmail(
      email,
      "We've received your message — Rynex Security",
      `
        <h2>Thanks for reaching out, ${escapeHtml(name)}.</h2>
        <p>We've received your ${escapeHtml(inquiryLabel).toLowerCase()} and will respond within 24 hours.</p>
        <p><strong>Your message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
        <p>— Rynex Security</p>
      `
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/contact] failed to send email", err);
    return NextResponse.json({ error: "Failed to deliver message. Please try again later." }, { status: 500 });
  }
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
