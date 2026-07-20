import type { Metadata } from "next";

import ServicesGrid from "./ServicesGrid";
import styles from "./services.module.css";

export const metadata: Metadata = {
  title: "Our Services | Rynex Security",
  description:
    "Explore Rynex Security's professional services, including VAPT, SOC monitoring, GRC & security compliance, threat hunting, malware analysis, and cloud security.",
};

export default function ServicesPage() {
  return (
    <>
      <section className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <p className={styles.pageEyebrow}>
            Cybersecurity Services
          </p>

          <h1 className={styles.pageTitle}>
            Our Professional Services
          </h1>

          <p className={styles.pageDescription}>
            Practical offensive and defensive cybersecurity services
            designed to identify risk, improve resilience, and protect
            critical systems.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <p className={styles.sectionEyebrow}>
              What We Offer
            </p>

            <h2 className={styles.sectionTitle}>
              Elite Security Solutions
            </h2>
          </div>

          <ServicesGrid />
        </div>
      </section>
    </>
  );
}