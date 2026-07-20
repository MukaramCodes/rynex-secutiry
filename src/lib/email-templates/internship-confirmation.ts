import "server-only";

const LOGO_URL = "https://ik.imagekit.io/t4itchmhb/logo.png";

const WEBSITE_URL =
  process.env.SITE_URL ??
  "https://rynexsecurity.com";

const INTERNSHIP_URL = `${WEBSITE_URL}/internship`;
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

export function buildInternshipConfirmationEmail(name: string) {
  const cleanedName = name.trim().slice(0, 100) || "Applicant";
  const safeName = escapeHtml(cleanedName);

  const subject =
    "Internship application received | Rynex Security";

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
      Your Rynex Security internship application has been received.
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
                  Thank you for applying to the Rynex Security internship
                  program.
                </p>

                <p
                  style="
                    margin:0 0 16px 0;
                    font-size:16px;
                    color:#374151;
                    line-height:1.7;
                  "
                >
                  Your application has been received successfully. Our team
                  will review your information, experience, and submitted
                  materials.
                </p>

                <p
                  style="
                    margin:0 0 16px 0;
                    font-size:16px;
                    color:#374151;
                    line-height:1.7;
                  "
                >
                  Applicants selected for the next stage will receive a
                  separate email containing interview, assessment, or
                  onboarding instructions.
                </p>

                <div
                  style="
                    margin:24px 0;
                    padding:14px 16px;
                    background-color:#eff6ff;
                    border-left:4px solid #00c2ff;
                    color:#1e3a5f;
                    font-size:15px;
                    line-height:1.7;
                  "
                >
                  This email confirms receipt of your application. It does not
                  mean that you have been shortlisted.
                </div>

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
                        href="${INTERNSHIP_URL}"
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
                        View Internship Program
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
                  For questions regarding your application, contact
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

                <div
                  style="
                    margin-top:16px;
                    font-size:13px;
                    color:#9ca3af;
                    line-height:1.7;
                  "
                >
                  This is an automated email confirming receipt of your
                  internship application.<br />
                  Replies are directed to ${CONTACT_EMAIL}.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `Dear ${cleanedName},

Thank you for applying to the Rynex Security internship program.

Your application has been received successfully. Our team will review your information, experience, and submitted materials.

Applicants selected for the next stage will receive a separate email containing further instructions.

This email confirms receipt of your application. It does not mean that you have been shortlisted.

Internship page: ${INTERNSHIP_URL}
Questions: ${CONTACT_EMAIL}

Rynex Security
Detect • Exploit • Secure`;

  return {
    subject,
    html,
    text,
  };
}