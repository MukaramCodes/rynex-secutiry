import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import { contactInfo } from "@/lib/site-data";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact Us | Rynex Security",
  description:
    "Contact Rynex Security for a consultation on VAPT, SOC, GRC, or any cybersecurity challenge. Reach us by email, phone, or our secure contact form.",
};

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.heading}>
          <h1 className={styles.title}>Get In Touch</h1>
          <p className={styles.subtitle}>Describe your challenge — we&apos;ll respond within 24 hours.</p>
        </div>

        <ContactForm />

        <div className={styles.bottom}>
          <a href={`mailto:${contactInfo.email}`} className={styles.bottomLink}>
            <i className="fas fa-envelope" aria-hidden="true" /> {contactInfo.email}
          </a>
          <a href={`tel:+92${contactInfo.phone}`} className={styles.bottomLink}>
            <i className="fas fa-phone" aria-hidden="true" /> {contactInfo.phoneDisplay}
          </a>
          <div className={styles.bottomSocial}>
            <a href={contactInfo.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in" aria-hidden="true" />
            </a>
            <a href={contactInfo.discord} target="_blank" rel="noreferrer" aria-label="Discord">
              <i className="fab fa-discord" aria-hidden="true" />
            </a>
            <a href={contactInfo.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
