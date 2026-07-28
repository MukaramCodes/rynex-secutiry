import "server-only";

import { MailtrapClient } from "mailtrap";

import {
  buildContactConfirmationEmail as buildContactTemplate,
} from "./email-templates/contact-confirmation";

import {
  buildInternshipConfirmationEmail as buildInternshipTemplate,
} from "./email-templates/internship-confirmation";

import { buildEventTicketEmail } from "./email-templates/event-ticket";

const NOTIFY_TO =
  process.env.CONTACT_NOTIFY_EMAIL ??
  "info@rynexsecurity.com";

const FROM_EMAIL =
  process.env.MAILTRAP_FROM_EMAIL ??
  "no-reply@rynexsecurity.com";

const FROM_NAME = "Rynex Security";

type SendArgs = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: SendArgs) {
  const token = process.env.MAILTRAP_API_KEY;

  if (!token) {
    console.warn(
      "[mailer] MAILTRAP_API_KEY not set — skipping email send.",
      {
        to,
        subject,
      },
    );

    return {
      skipped: true,
    };
  }

  const client = new MailtrapClient({
    token,
  });

  await client.send({
    from: {
      email: FROM_EMAIL,
      name: FROM_NAME,
    },
    to: [
      {
        email: to,
      },
    ],
    subject,
    html,
    ...(text ? { text } : {}),
    ...(replyTo
      ? {
          reply_to: {
            email: replyTo,
          },
        }
      : {}),
  });

  return {
    skipped: false,
  };
}

/**
 * Sends an internal notification to the Rynex team.
 */
export async function sendTeamNotification(
  subject: string,
  html: string,
  replyTo?: string,
) {
  return sendEmail({
    to: NOTIFY_TO,
    subject,
    html,
    replyTo,
  });
}

/**
 * Retained in case other code still uses the older generic function.
 */
export async function sendConfirmationEmail(
  to: string,
  subject: string,
  html: string,
) {
  return sendEmail({
    to,
    subject,
    html,
    replyTo: NOTIFY_TO,
  });
}

/**
 * Sends the branded contact confirmation email.
 */
export async function sendContactConfirmationEmail(
  to: string,
  name: string,
) {
  const template = buildContactTemplate(name);

  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
    text: template.text,
    replyTo: NOTIFY_TO,
  });
}

/**
 * Sends the branded internship confirmation email.
 */
export async function sendInternshipConfirmationEmail(
  to: string,
  fullName: string,
  track: string,
) {
  // The current template only requires the applicant name.
  // The route still passes track so it can be added to the template later.
  void track;

  const template = buildInternshipTemplate(fullName);

  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
    text: template.text,
    replyTo: NOTIFY_TO,
  });
}

/**
 * Sends the branded event ticket confirmation email.
 */
export async function sendEventRegistrationEmail(data: {
  to: string;
  name: string;
  ticketToken: string;
  groupName?: string;
  category?: string;
}) {
  const template = buildEventTicketEmail({
    name: data.name,
    ticketToken: data.ticketToken,
    groupName: data.groupName,
    category: data.category,
  });

  return sendEmail({
    to: data.to,
    subject: template.subject,
    html: template.html,
    text: template.text,
    replyTo: NOTIFY_TO,
  });
}