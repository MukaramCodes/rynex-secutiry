import type { Metadata } from "next";
import ServicesGrid from "./ServicesGrid";
import styles from "./services.module.css";

export const metadata: Metadata = {
  title: "Our Services | Rynex Security",
  description:
    "Explore Rynex Security's professional services: VAPT, SOC monitoring, GRC compliance, threat hunting, malware analysis, and comprehensive security audits.",
};

export default function ServicesPage() {
  return (
    <>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <h1 className={styles.pageTitle}>Our Professional Services</h1>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <p className={styles.sectionEyebrow}>What We Offer</p>
            <h2 className={styles.sectionTitle}>Elite Security Solutions</h2>
          </div>
          <ServicesGrid />
        </div>
      </section>
    </>
  );
}
