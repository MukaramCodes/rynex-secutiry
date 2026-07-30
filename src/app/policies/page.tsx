import type { Metadata } from "next";
import styles from "./policies.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy | Rynex Security",
  description:
    "Rynex Security's privacy policy and governance charter — ethical hacking standards, data protection, compliance frameworks, responsible disclosure, and corporate ethics.",
};

const tocItems = [
  { num: "01", label: "Welcome & Corporate Mission" },
  { num: "02", label: "Service Directory" },
  { num: "03", label: "Ethical Standards & Rules of Engagement" },
  { num: "04", label: "Responsible Disclosure & Research" },
  { num: "05", label: "Cybersecurity Internship Program" },
  { num: "06", label: "Data Protection & Retention" },
  { num: "07", label: "Compliance Alignment & Governance" },
  { num: "08", label: "Corporate & Operational Ethics" },
  { num: "09", label: "Policy Updates & Contact" },
];

export default function PoliciesPage() {
  return (
    <>
      {/* ─── Page Header ─── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <h1 className={styles.pageTitle}>Policies &amp; Governance Charter</h1>
          <p className={styles.pageSubtitle}>
            Public commitments, ethical hacking standards, and compliance frameworks governing
            Rynex Security operations.
          </p>
          <div className={styles.pageMeta}>
            <span>
              <i className="fas fa-building" aria-hidden="true" />
              Rynex Security
            </span>
            <span>
              <i className="fas fa-user-shield" aria-hidden="true" />
              Owner: CISO &amp; MD
            </span>
            <span>
              <i className="fas fa-code-branch" aria-hidden="true" />
              Version 1.0
            </span>
            <span>
              <i className="fas fa-calendar" aria-hidden="true" />
              2026-07
            </span>
          </div>
        </div>
      </div>

      {/* ─── Table of Contents ─── */}
      <div className={styles.tocSection}>
        <div className={styles.tocInner}>
          <p className={styles.tocTitle}>Table of Contents</p>
          <div className={styles.tocGrid}>
            {tocItems.map((item) => (
              <a key={item.num} href={`#section-${item.num}`} className={styles.tocLink}>
                <span className={styles.tocNumber}>{item.num}</span>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 1. Welcome & Corporate Mission ─── */}
      <section id="section-01" className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>01</span>
            <h2 className={styles.sectionTitle}>Welcome &amp; Corporate Mission</h2>
          </div>
          <p className={styles.bodyText}>
            Rynex Security is a cybersecurity company headquartered in Pakistan, providing
            professional cybersecurity services to organizations worldwide. We are committed to
            protecting our clients through ethical security testing, responsible disclosure,
            industry best practices, and continuous innovation.
          </p>
          <p className={styles.bodyText}>
            Our mission is to help organizations strengthen their security posture by identifying
            vulnerabilities before malicious actors can exploit them. We believe cybersecurity
            should be ethical, transparent, practical, and accessible.
          </p>
          <h3 className={styles.subHeading}>Core Values</h3>
          <ul className={styles.valuesList}>
            <li>Integrity in every client engagement.</li>
            <li>Strict client confidentiality.</li>
            <li>Responsible security research.</li>
            <li>Continuous learning and skill development.</li>
            <li>Ethical hacking within strict boundaries.</li>
            <li>Transparency and professional accountability.</li>
            <li>Respect for privacy and applicable international regulations.</li>
          </ul>
        </div>
      </section>

      {/* ─── 2. Service Directory ─── */}
      <section id="section-02" className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>02</span>
            <h2 className={styles.sectionTitle}>Service Directory</h2>
          </div>
          <p className={styles.bodyText}>
            Rynex Security provides a broad range of offensive, defensive, and advisory
            cybersecurity services:
          </p>
          <ul className={styles.valuesList}>
            <li>Web and Mobile Application Penetration Testing (VAPT)</li>
            <li>API Security Assessments &amp; Webhook Validation</li>
            <li>Internal &amp; External Network Infrastructure Audits</li>
            <li>Cloud Security Assessments (AWS, Azure, and Google Cloud)</li>
            <li>Active Directory Security Audits &amp; Privilege Analysis</li>
            <li>Red Team Simulations &amp; Ethical Exploit Verification</li>
            <li>Secure Code Review &amp; Dependency Analysis</li>
            <li>Security Consulting &amp; Framework Alignment Reviews</li>
            <li>Capture The Flag (CTF) Events &amp; Internship Training Programs</li>
          </ul>
        </div>
      </section>

      {/* ─── 3. Ethical Standards & Rules of Engagement ─── */}
      <section id="section-03" className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>03</span>
            <h2 className={styles.sectionTitle}>Ethical Standards &amp; Rules of Engagement</h2>
          </div>
          <h3 className={styles.subHeading}>Our Ethical Commitments</h3>
          <p className={styles.bodyText}>
            Rynex Security security researchers and consultants adhere to strict ethical
            guidelines. We will never:
          </p>
          <ol className={styles.numberedList}>
            <li>Perform unauthorized security assessments or scans.</li>
            <li>Access networks or systems without explicit written permissions.</li>
            <li>Intentionally disrupt client production environments.</li>
            <li>Sell, trade, or disclose client system data.</li>
            <li>Exploit discovered vulnerabilities for personal or external benefit.</li>
          </ol>

          <h3 className={styles.subHeading}>Client Engagement Policy</h3>
          <p className={styles.bodyText}>
            Before any security assessment begins, an authorization charter must be signed defining
            targets, scopes, methodology, rules of engagement, and escalation paths.
          </p>
          <div className={styles.highlightCard}>
            <p>
              Unless explicitly authorized, we exclude destructive attacks, Denial of Service (DoS),
              data deletion, physical security testing, or attacks against third-party providers
              (Vercel, Supabase, Hostinger, etc.).
            </p>
          </div>
        </div>
      </section>

      {/* ─── 4. Responsible Disclosure & Research Policy ─── */}
      <section id="section-04" className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>04</span>
            <h2 className={styles.sectionTitle}>
              Responsible Disclosure &amp; Research Policy
            </h2>
          </div>
          <p className={styles.bodyText}>
            Rynex Security supports public responsible vulnerability disclosure and cybersecurity
            research. External security researchers reporting vulnerabilities must:
          </p>
          <ul className={styles.valuesList}>
            <li>Act in good faith and avoid privacy violations.</li>
            <li>Refrain from data destruction or service disruptions.</li>
            <li>Provide complete technical reproduction details and proof-of-concepts.</li>
            <li>Allow reasonable remediation time before public disclosure.</li>
          </ul>
          <div className={styles.highlightCard}>
            <p>
              All published research by Rynex employees must protect client confidentiality and
              comply with contractual obligations.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 5. Cybersecurity Internship Program ─── */}
      <section id="section-05" className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>05</span>
            <h2 className={styles.sectionTitle}>Cybersecurity Internship Program</h2>
          </div>
          <p className={styles.bodyText}>
            Rynex Security operates a remote cybersecurity training program to support skill
            development:
          </p>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <p className={styles.infoLabel}>Program Duration</p>
              <p className={styles.infoValue}>6 Weeks</p>
            </div>
            <div className={styles.infoCard}>
              <p className={styles.infoLabel}>Delivery Model</p>
              <p className={styles.infoValue}>Remote (Virtual)</p>
            </div>
            <div className={styles.infoCard}>
              <p className={styles.infoLabel}>Financial Model</p>
              <p className={styles.infoValue}>
                Unpaid (On-site internships may vary based on program details)
              </p>
            </div>
          </div>
          <div className={styles.highlightCard}>
            <p>
              Although interns are not required to sign a Non-Disclosure Agreement (NDA), they must
              strictly comply with the Internee Code of Conduct, Ethical Standards, and Acceptable
              Use requirements. Violations will result in immediate removal from the program.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 6. Data Protection & Retention Policy ─── */}
      <section id="section-06" className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>06</span>
            <h2 className={styles.sectionTitle}>Data Protection &amp; Retention Policy</h2>
          </div>
          <p className={styles.bodyText}>
            Client information is protected using industry-standard controls, including data
            encryption, access controls, secure storage, and least-privilege policies.
          </p>
          <h3 className={styles.subHeading}>Data Retention Life-Cycle</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <p className={styles.infoLabel}>Standard Retention</p>
              <p className={styles.infoValue}>
                Client engagement files, scan reports, and audit logs are retained for up to three
                (3) months after project delivery.
              </p>
            </div>
            <div className={styles.infoCard}>
              <p className={styles.infoLabel}>Compliance Retention</p>
              <p className={styles.infoValue}>
                Data may be retained longer if required for legal, contractual, or regulatory
                compliance.
              </p>
            </div>
            <div className={styles.infoCard}>
              <p className={styles.infoLabel}>Secure Disposal</p>
              <p className={styles.infoValue}>
                All expired documents and data databases are securely deleted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. Compliance Alignment & Governance ─── */}
      <section id="section-07" className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>07</span>
            <h2 className={styles.sectionTitle}>Compliance Alignment &amp; Governance</h2>
          </div>
          <p className={styles.bodyText}>
            Our operational practices and security programs are informed by internationally
            recognized frameworks:
          </p>
          <div className={styles.complianceGrid}>
            <div className={styles.complianceBadge}>
              <i className="fas fa-certificate" aria-hidden="true" />
              <div className={styles.complianceBadgeText}>
                <span className={styles.complianceName}>ISO/IEC 27001</span>
                <span className={styles.complianceDesc}>
                  Information Security Management Standards
                </span>
              </div>
            </div>
            <div className={styles.complianceBadge}>
              <i className="fas fa-shield-alt" aria-hidden="true" />
              <div className={styles.complianceBadgeText}>
                <span className={styles.complianceName}>NIST CSF</span>
                <span className={styles.complianceDesc}>Cybersecurity Framework</span>
              </div>
            </div>
            <div className={styles.complianceBadge}>
              <i className="fas fa-bug" aria-hidden="true" />
              <div className={styles.complianceBadgeText}>
                <span className={styles.complianceName}>OWASP</span>
                <span className={styles.complianceDesc}>Testing Guide Standards</span>
              </div>
            </div>
            <div className={styles.complianceBadge}>
              <i className="fas fa-lock" aria-hidden="true" />
              <div className={styles.complianceBadgeText}>
                <span className={styles.complianceName}>SOC 2</span>
                <span className={styles.complianceDesc}>Security Trust Principles</span>
              </div>
            </div>
          </div>
          <div className={styles.highlightCard}>
            <p>
              Alignment with these frameworks is maintained for quality assurance and does not
              imply certification unless explicitly stated by Rynex Security.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 8. Corporate & Operational Ethics ─── */}
      <section id="section-08" className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>08</span>
            <h2 className={styles.sectionTitle}>Corporate &amp; Operational Ethics</h2>
          </div>
          <h3 className={styles.subHeading}>Anti-Bribery &amp; Anti-Corruption</h3>
          <p className={styles.bodyText}>
            We maintain a zero-tolerance policy toward bribery, corruption, fraud, or unethical
            business practices. All representatives must conduct business honestly and
            professionally.
          </p>
          <h3 className={styles.subHeading}>Equal Opportunity</h3>
          <p className={styles.bodyText}>
            Rynex Security is committed to maintaining an inclusive environment. Employment,
            internships, and collaboration opportunities are based on merit, skills, and
            professionalism. Harassment, discrimination, or bullying will not be tolerated.
          </p>
        </div>
      </section>

      {/* ─── 9. Policy Updates & Contact ─── */}
      <section id="section-09" className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>09</span>
            <h2 className={styles.sectionTitle}>Policy Updates &amp; Contact Information</h2>
          </div>
          <p className={styles.bodyText}>
            These policies may be updated periodically to reflect changes in legal requirements,
            industry standards, or company operations. The latest version published on our website
            supersedes previous versions.
          </p>
        </div>
      </section>

      {/* ─── Contact Bar ─── */}
      <div className={styles.contactBar}>
        <div className={styles.contactBarInner}>
          <p className={styles.contactBarTitle}>Corporate Contact</p>
          <div className={styles.contactBarLinks}>
            <a href="https://www.rynexsecurity.com" className={styles.contactLink}>
              <i className="fas fa-globe" aria-hidden="true" />
              www.rynexsecurity.com
            </a>
            <a href="mailto:info@rynexsecurity.com" className={styles.contactLink}>
              <i className="fas fa-envelope" aria-hidden="true" />
              info@rynexsecurity.com
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
