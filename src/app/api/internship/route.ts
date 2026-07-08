import { NextResponse } from "next/server";
import { sendTeamNotification, sendConfirmationEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  const body = await req.json();
  const { fullName, email, track, education, resumeLink, message, website } = body;

  // Honeypot: bots fill hidden fields, humans don't.
  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (!fullName || !email || !track || !message) {
    return NextResponse.json(
      { error: "Full name, email, track, and message are required." },
      { status: 400 }
    );
  }

  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  try {
    await sendTeamNotification(
      `New internship application from ${fullName} (${track})`,
      `
        <h2>New internship application</h2>
        <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Track:</strong> ${escapeHtml(track)}</p>
        ${education ? `<p><strong>Education:</strong> ${escapeHtml(education)}</p>` : ""}
        ${resumeLink ? `<p><strong>Resume/LinkedIn:</strong> ${escapeHtml(resumeLink)}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
      `,
      email
    );

    await sendConfirmationEmail(
      email,
      "Application received — Rynex Security Internship 2026",
      `
        <h2>Thanks for applying, ${escapeHtml(fullName)}.</h2>
        <p>We've received your application for the <strong>${escapeHtml(track)}</strong> track of the
        Rynex Security Internship Program 2026. Our team reviews applications on a rolling basis —
        we'll follow up by email once shortlisting is complete.</p>
        <p>— Rynex Security</p>
      `
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/internship] failed to send email", err);
    return NextResponse.json(
      { error: "Failed to submit application. Please try again later." },
      { status: 500 }
    );
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
