export function buildEventTicketEmail(data: {
  name: string;
  ticketToken: string;
  groupName?: string;
  category?: string;
}) {
  const { name, ticketToken, groupName, category } = data;
  const groupText = groupName ? groupName : "Individual";

  const subject = `Your Rynex Eclipse 2026 Ticket [${ticketToken}]`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Rynex Eclipse 2026 Ticket</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #030712; color: #f3f4f6; margin: 0; padding: 20px; }
        .card { max-width: 600px; margin: 0 auto; background: #0f172a; border: 1px solid #00d4ff; border-radius: 12px; padding: 32px; box-shadow: 0 0 30px rgba(0, 212, 255, 0.2); }
        .header { text-align: center; border-bottom: 1px solid #1e293b; padding-bottom: 20px; margin-bottom: 24px; }
        .title { color: #00d4ff; font-size: 24px; font-weight: bold; margin: 0; }
        .tagline { color: #94a3b8; font-size: 14px; margin-top: 4px; }
        .ticketBox { background: #030712; border: 2px dashed #00d4ff; padding: 20px; border-radius: 8px; text-align: center; margin: 24px 0; }
        .ticketToken { font-family: monospace; font-size: 22px; font-weight: bold; color: #00ffaa; letter-spacing: 2px; }
        .details { line-height: 1.8; color: #cbd5e1; }
        .details strong { color: #ffffff; }
        .footer { text-align: center; font-size: 12px; color: #64748b; margin-top: 30px; border-top: 1px solid #1e293b; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="title">RYNEX ECLIPSE 2026</div>
          <div class="tagline">Capture The Flag Competition | Think . Capture . Compete</div>
        </div>

        <p>Hi <strong>${name}</strong>,</p>
        <p>Congratulations! Your pre-registration for <strong>Rynex Eclipse 2026</strong> has been received successfully.</p>

        <div class="ticketBox">
          <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px;">OFFICIAL CTF EVENT TICKET</div>
          <div class="ticketToken">${ticketToken}</div>
        </div>

        <div class="details">
          <p><strong>Participant Name:</strong> ${name}</p>
          <p><strong>Group / Team / Org:</strong> ${groupText}</p>
          <p><strong>Category:</strong> ${category || "Competitor"}</p>
          <p><strong>Registration Fee:</strong> PKR 500 per participant</p>
          <p><strong>Location:</strong> Rahim Yar Khan, Pakistan</p>
          <p><strong>Event Status:</strong> Pre-registered (Coming Soon 2026)</p>
        </div>

        <p style="margin-top: 24px;">Our event team will reach out to you shortly with fee payment details and CTF platform login credentials.</p>

        <div class="footer">
          <p>Rynex Security — Detect . Exploit . Secure</p>
          <p>Contact: info@rynexsecurity.com | +92 327 287 3812</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    RYNEX ECLIPSE 2026 — OFFICIAL CTF TICKET
    Ticket Token: ${ticketToken}
    Name: ${name}
    Group/Team: ${groupText}
    Category: ${category || "Competitor"}
    Registration Fee: PKR 500
    Location: Rahim Yar Khan, Pakistan

    Thank you for registering for Rynex Eclipse 2026!
    Our team will reach out with payment instructions and CTF portal credentials.
  `;

  return { subject, html, text };
}
