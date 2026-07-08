import Button from "@/components/Button";
import WhoWeAreVisual from "@/components/WhoWeAreVisual";
import styles from "./home.module.css";

const coreExpertise = [
  {
    icon: "fa-shield-virus",
    title: "VAPT",
    text: "Identify vulnerabilities through real-world attack simulations and strengthen your systems against cyber threats.",
  },
  {
    icon: "fa-user-secret",
    title: "SOC",
    text: "Continuous monitoring and rapid response to detect and mitigate security incidents in real time.",
  },
  {
    icon: "fa-file-contract",
    title: "GRC",
    text: "Align your organization with industry standards while managing risks and ensuring compliance.",
  },
];

const whyUs = [
  {
    icon: "fa-laptop-code",
    title: "Practical Expertise",
    text: "We focus on real-world cybersecurity skills, not just theory.",
  },
  {
    icon: "fa-project-diagram",
    title: "Offensive Security Approach",
    text: "We think like attackers to defend your systems effectively.",
  },
  {
    icon: "fa-user-tie",
    title: "Hands-On Learning",
    text: "Providing real experience through practical cybersecurity methods.",
  },
];

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Rynex Security</p>
          <h1 className={styles.heroTitle}>Detect. Exploit. Secure.</h1>
          <p className={styles.heroSubtitle}>
            Advanced cybersecurity solutions designed to protect, analyze, and strengthen your
            digital infrastructure against modern threats.
          </p>
          <div className={styles.heroActions}>
            <Button href="/services">Our Services</Button>
            <Button href="/contact" variant="onDark">Contact Us</Button>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.aboutFlex}>
            <div>
              <p className={styles.sectionEyebrow}>Who We Are</p>
              <h2 className={styles.sectionTitle}>Practical security, not just theory</h2>
              <p className={styles.sectionText} style={{ marginBottom: "1rem" }}>
                Rynex Security is a modern cybersecurity company focused on delivering
                real-world security solutions and hands-on expertise. We bridge the gap between
                theory and practical implementation.
              </p>
              <p className={styles.sectionText} style={{ marginBottom: "2rem" }}>
                Our mission is to empower individuals and organizations with advanced offensive
                and defensive security techniques, ensuring they stay ahead in an evolving threat
                landscape.
              </p>
              <Button href="/about" variant="ghost">Learn more about us</Button>
            </div>
            <WhoWeAreVisual />
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <p className={styles.sectionEyebrow}>Our Core Expertise</p>
            <h2 className={styles.sectionTitle}>Elite security solutions</h2>
          </div>
          <div className={styles.cardGrid}>
            {coreExpertise.map((item) => (
              <div key={item.title} className={styles.card}>
                <i className={`fas ${item.icon} ${styles.cardIcon}`} aria-hidden="true" />
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardText}>{item.text}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "2.5rem" }}>
            <Button href="/services">Explore all services</Button>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <p className={styles.sectionEyebrow}>Why Rynex Security</p>
            <h2 className={styles.sectionTitle}>Why choose us</h2>
          </div>
          <div className={styles.cardGrid}>
            {whyUs.map((item) => (
              <div key={item.title} className={styles.card}>
                <i className={`fas ${item.icon} ${styles.cardIcon}`} aria-hidden="true" />
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardText}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.sectionInner}>
          <h2 className={styles.ctaTitle}>Secure your digital future</h2>
          <p className={styles.ctaText}>
            Take control of your cybersecurity with expert solutions, real-world techniques, and
            advanced protection strategies.
          </p>
          <div className={styles.ctaActions}>
            <Button href="/contact" variant="onDark">Get started now</Button>
          </div>
        </div>
      </section>
    </>
  );
}
