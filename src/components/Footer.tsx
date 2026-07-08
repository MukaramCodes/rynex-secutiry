import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";
import { contactInfo } from "@/lib/site-data";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <div className={styles.brand}>
            <Image
              src="/images/logo.png"
              alt="Rynex Security Logo"
              width={28}
              height={28}
              className="logoAnimated"
            />
            Rynex Security
          </div>
          <p className={styles.desc}>
            Leading the way in practical cybersecurity training and professional security
            services. Detect, Exploit, and Secure with the best in the industry.
          </p>
          <div className={styles.social}>
            <a href={contactInfo.discordFooter} aria-label="Discord" target="_blank" rel="noreferrer">
              <i className="fab fa-discord" aria-hidden="true" />
            </a>
            <a href={contactInfo.linkedin} aria-label="LinkedIn" target="_blank" rel="noreferrer">
              <i className="fab fa-linkedin-in" aria-hidden="true" />
            </a>
            <a href={contactInfo.instagram} aria-label="Instagram" target="_blank" rel="noreferrer">
              <i className="fab fa-instagram" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div>
          <h4 className={styles.colTitle}>Quick Links</h4>
          <ul className={styles.links}>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/services">Our Services</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/internship">Internship</Link></li>
          </ul>
        </div>

        <div>
          <h4 className={styles.colTitle}>Contact Info</h4>
          <div className={styles.contactItem}>
            <i className="fas fa-envelope" aria-hidden="true" />
            <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
          </div>
          <div className={styles.contactItem}>
            <i className="fas fa-phone" aria-hidden="true" />
            <a href={`tel:+92${contactInfo.phone}`}>{contactInfo.phoneDisplay}</a>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <p className={styles.copyright}>
          &copy; 2026 Rynex Security. All Rights Reserved. | Designed for Excellence.
        </p>
      </div>
    </footer>
  );
}
