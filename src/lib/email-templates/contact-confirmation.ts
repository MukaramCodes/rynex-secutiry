import "server-only";

const LOGO_URL = "https://ik.imagekit.io/t4itchmhb/logo.png";

const WEBSITE_URL =
  process.env.SITE_URL ??
  "https://www.rynexsecurity.com";

const CONTACT_EMAIL = "info@rynexsecurity.com";

function escapeHtml(value: string): string {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  return value.replace(/[&<>"']/g, (character) => {
    return entities[character];
  });
}

export function buildContactConfirmationEmail(name: string) {
  const cleanedName = name.trim().slice(0, 100) || "Customer";
  const safeName = escapeHtml(cleanedName);

  const subject = "We received your message | Rynex Security";

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>${subject}</title>
  </head>

  <body
    style="
      margin:0;
      padding:0;
      background-color:#f4f6f8;
      font-family:Arial,Helvetica,sans-serif;
    "
  >
    <div
      style="
        display:none;
        max-height:0;
        overflow:hidden;
        opacity:0;
        color:transparent;
      "
    >
      We have received your message and will contact you soon.
    </div>

    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="background-color:#f4f6f8;padding:24px 12px;"
    >
      <tr>
        <td align="center">
          <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="
              max-width:640px;
              background-color:#ffffff;
              border-radius:16px;
              overflow:hidden;
              box-shadow:0 10px 30px rgba(0,0,0,0.08);
            "
          >
            <tr>
              <td
                style="
                  background-color:#000000;
                  padding:24px 32px;
                  text-align:center;
                "
              >
                <img
                  src="${LOGO_URL}"
                  alt="Rynex Security Logo"
                  width="72"
                  height="72"
                  style="
                    display:block;
                    margin:0 auto 12px auto;
                    border-radius:12px;
                  "
                />

                <div
                  style="
                    font-size:28px;
                    font-weight:bold;
                    color:#ffffff;
                    letter-spacing:0.4px;
                  "
                >
                  Rynex Security
                </div>

                <div
                  style="
                    font-size:15px;
                    font-weight:bold;
                    color:#00c2ff;
                    margin-top:6px;
                  "
                >
                  Detect • Exploit • Secure
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:32px;">
                <p
                  style="
                    margin:0 0 16px 0;
                    font-size:18px;
                    color:#1f2937;
                    line-height:1.7;
                  "
                >
                  Dear ${safeName},
                </p>

                <p
                  style="
                    margin:0 0 16px 0;
                    font-size:16px;
                    color:#374151;
                    line-height:1.7;
                  "
                >
                  Thank you for contacting Rynex Security. Your message has
                  been received successfully.
                </p>

                <p
                  style="
                    margin:0 0 16px 0;
                    font-size:16px;
                    color:#374151;
                    line-height:1.7;
                  "
                >
                  Our team will review your request and respond as soon as
                  possible.
                </p>

                <p
                  style="
                    margin:0 0 24px 0;
                    font-size:16px;
                    color:#374151;
                    line-height:1.7;
                  "
                >
                  Please keep this email as confirmation that your message was
                  submitted.
                </p>

                <table
                  role="presentation"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="margin:28px auto;"
                >
                  <tr>
                    <td
                      align="center"
                      style="
                        background-color:#00c2ff;
                        border-radius:8px;
                      "
                    >
                      <a
                        href="${WEBSITE_URL}"
                        target="_blank"
                        rel="noopener noreferrer"
                        style="
                          display:inline-block;
                          padding:14px 24px;
                          color:#000000;
                          font-size:16px;
                          font-weight:bold;
                          text-decoration:none;
                          border-radius:8px;
                        "
                      >
                        Visit Rynex Security
                      </a>
                    </td>
                  </tr>
                </table>

                <p
                  style="
                    margin:0;
                    font-size:16px;
                    color:#374151;
                    line-height:1.7;
                  "
                >
                  For additional questions, contact us at
                  <a
                    href="mailto:${CONTACT_EMAIL}"
                    style="color:#2563eb;text-decoration:none;"
                  >
                    ${CONTACT_EMAIL}
                  </a>.
                </p>
              </td>
            </tr>

            <tr>
              <td
                style="
                  background-color:#000000;
                  padding:24px 32px;
                  text-align:center;
                "
              >
                <div
                  style="
                    font-size:20px;
                    font-weight:bold;
                    color:#ffffff;
                    margin-bottom:6px;
                  "
                >
                  Rynex Security
                </div>

                <div
                  style="
                    font-size:14px;
                    color:#cbd5e1;
                    margin-bottom:8px;
                  "
                >
                  Offensive Security • Penetration Testing • Cloud Security
                </div>

                <a
                  href="${WEBSITE_URL}"
                  target="_blank"
                  rel="noopener noreferrer"
                  style="
                    display:inline-block;
                    color:#00c2ff;
                    text-decoration:none;
                    font-size:14px;
                  "
                >
                  ${WEBSITE_URL}
                </a>


              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `Dear ${cleanedName},

Thank you for contacting Rynex Security.

Your message has been received successfully. Our team will review your request and respond as soon as possible.

Website: ${WEBSITE_URL}
Email: ${CONTACT_EMAIL}

Rynex Security
Detect • Exploit • Secure`;

  return {
    subject,
    html,
    text,
  };
}