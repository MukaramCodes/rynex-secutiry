import { MailtrapClient } from "mailtrap";

const NOTIFY_TO = process.env.CONTACT_NOTIFY_EMAIL ?? "info@rynexsecurity.com";
const FROM_EMAIL = process.env.MAILTRAP_FROM_EMAIL ?? "no-reply@rynexsecurity.com";
const FROM_NAME = "Rynex Security";

type SendArgs = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

async function sendEmail({ to, subject, html, replyTo }: SendArgs) {
  const token = process.env.MAILTRAP_API_KEY;

  if (!token) {
    console.warn(
      "[mailer] MAILTRAP_API_KEY not set — skipping email send. Submission was still validated.",
      { to, subject }
    );
    return { skipped: true };
  }

  const client = new MailtrapClient({ token });

  await client.send({
    from: { email: FROM_EMAIL, name: FROM_NAME },
    to: [{ email: to }],
    subject,
    html,
    ...(replyTo ? { reply_to: { email: replyTo } } : {}),
  });

  return { skipped: false };
}

/** Notifies the Rynex team about a new form submission. */
export async function sendTeamNotification(subject: string, html: string, replyTo?: string) {
  return sendEmail({ to: NOTIFY_TO, subject, html, replyTo });
}

/** Sends a confirmation receipt back to the person who submitted a form. */
export async function sendConfirmationEmail(to: string, subject: string, html: string) {
  return sendEmail({ to, subject, html, replyTo: NOTIFY_TO });
}
