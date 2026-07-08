import Image from "next/image";
import type { Metadata } from "next";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About Us | Rynex Security",
  description:
    "Learn about Rynex Security — a team of ethical hackers and security researchers delivering practical offensive and defensive cybersecurity solutions across Pakistan.",
};

export default function AboutPage() {
  return (
    <>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <h1 className={styles.pageTitle}>About Us</h1>
          <p className={styles.pageSubtitle}>
            Empowering cybersecurity through real-world expertise and advanced offensive security
            practices.
          </p>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.legacyFlex}>
            <div>
              <p className={styles.sectionEyebrow}>Our Legacy</p>
              <h2 className={styles.sectionTitle}>Built on real-world expertise</h2>
              <p className={styles.bodyText}>
                Rynex Security was founded with a clear mission — to bring practical
                cybersecurity knowledge and real-world expertise to individuals and
                organizations. In a landscape where threats are constantly evolving, we focus on
                delivering solutions that work beyond theory.
              </p>
              <p className={styles.bodyText}>
                We are a community of ethical hackers, security researchers, and cybersecurity
                professionals dedicated to building strong defensive and offensive capabilities.
                Our approach is hands-on, realistic, and aligned with modern attack
                methodologies.
              </p>
            </div>
            <Image
              src="https://ik.imagekit.io/t4itchmhb/legacy.png"
              alt="Rynex Security Research Lab"
              width={640}
              height={480}
              className={styles.image}
            />
          </div>
        </div>
      </section>

      <section className={`${styles.section}`} style={{ background: "var(--gray-10)", paddingTop: 0, paddingBottom: 0 }}>
        <div className={styles.mvGrid}>
          <div className={styles.mvCard}>
            <i className={`fas fa-bullseye ${styles.mvIcon}`} aria-hidden="true" />
            <h3 className={styles.mvTitle}>Our Mission</h3>
            <p className={styles.mvText}>
              To empower individuals and organizations with practical cybersecurity skills,
              advanced threat defense techniques, and real-world security solutions.
            </p>
          </div>
          <div className={styles.mvCard}>
            <i className={`fas fa-eye ${styles.mvIcon}`} aria-hidden="true" />
            <h3 className={styles.mvTitle}>Our Vision</h3>
            <p className={styles.mvText}>
              To become a leading cybersecurity platform recognized for innovation, hands-on
              training, and impactful security services across the region.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <p className={styles.sectionEyebrow} style={{ textAlign: "center" }}>
            A Message from Our Founder
          </p>
          <div className={styles.founderCard}>
            <i className={`fas fa-quote-left ${styles.quoteIcon}`} aria-hidden="true" />
            <p className={styles.quote}>
              &quot;At Rynex Security, we believe that true security is not a product, but a
              process of continuous learning and adaptation. Our commitment is to provide the
              most rigorous, practical, and effective cybersecurity solutions in the industry.
              We don&apos;t just secure systems; we empower the people who run them.&quot;
            </p>
            <div className={styles.founderName}>Muhammad Hamza Zahid</div>
            <div className={styles.founderRole}>Founder &amp; Chief Executive Officer</div>
          </div>
        </div>
      </section>
    </>
  );
}
