import type { Metadata } from "next";
import Link from "next/link";
import NetworkBackground from "@/components/NetworkBackground";
import Button from "@/components/Button";
import HiringProcess from "./HiringProcess";
import NextSteps from "./NextSteps";
import styles from "./careers.module.css";
import { stories, featuredJobs } from "./data";

export const metadata: Metadata = {
  title: "Careers | Rynex Security",
  description:
    "Join the Rynex Security team. Explore open positions in penetration testing, SOC operations, GRC consulting, and cloud security. Build your career in cybersecurity.",
};

const whyUs = [
  {
    icon: "fa-bullseye",
    title: "Real Impact",
    text: "Every project you work on protects real organizations from real threats. Our work is operational — not academic.",
  },
  {
    icon: "fa-users",
    title: "Expert Team",
    text: "Collaborate with experienced offensive and defensive security professionals who are genuinely passionate about the craft.",
  },
  {
    icon: "fa-globe",
    title: "Remote-First",
    text: "We operate across time zones with a flexible, results-driven culture. Work from anywhere, deliver excellent security.",
  },
];

export default function CareersPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────── */}
      <section className={styles.hero}>
        <NetworkBackground />
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Rynex Security — Careers</p>
          <h1 className={styles.heroTitle}>
            Build Your Career in <span>Cybersecurity</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Join a team of elite security professionals protecting organizations from
            real-world threats. Offensive, defensive, and governance roles available.
          </p>
          <div className={styles.heroActions}>
            <Button href="/careers/jobs">Search Jobs</Button>
            <Button href="/contact" variant="onDark">Get in Touch</Button>
          </div>
        </div>
      </section>

      {/* ── Hiring Process ────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <p className={styles.sectionEyebrow}>How We Hire</p>
            <h2 className={styles.sectionTitle}>Our Hiring Process</h2>
            <p className={styles.sectionText}>
              We keep our process transparent, human, and straightforward. Select any
              step below to learn exactly what to expect at each stage.
            </p>
          </div>
          <HiringProcess />
        </div>
      </section>

      {/* ── Why Join Rynex ────────────────────────────── */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <p className={styles.sectionEyebrow}>Why Rynex Security</p>
            <h2 className={styles.sectionTitle}>Why join our team</h2>
            <p className={styles.sectionText}>
              We are a team built on trust, expertise, and a genuine commitment to
              advancing cybersecurity. Here is what you gain by joining us.
            </p>
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

      {/* ── Employee Stories ──────────────────────────── */}
      <section className={`${styles.section} ${styles.sectionDark}`}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <p className={styles.sectionEyebrowLight}>Team Stories</p>
            <h2 className={styles.sectionTitleLight}>Hear from the team</h2>
            <p className={styles.sectionTextLight}>
              Real experiences from the people who make Rynex Security what it is.
            </p>
          </div>

          <div className={styles.storiesGrid}>
            {stories.map((story) => (
              <article key={story.name} className={styles.storyCard}>
                <span className={styles.storyQuoteMark} aria-hidden="true">&ldquo;</span>
                <p className={styles.storyQuote}>{story.quote}</p>
                <div className={styles.storyAuthor}>
                  <div className={styles.storyAvatar} aria-hidden="true">
                    {story.initial}
                  </div>
                  <div>
                    <p className={styles.storyName}>{story.name}</p>
                    <p className={styles.storyRole}>{story.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.storiesActions}>
            <Button href="/blog" variant="onDark">
              Discover More Stories
            </Button>
          </div>
        </div>
      </section>

      {/* ── Featured Open Positions ───────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <p className={styles.sectionEyebrow}>Open Positions</p>
            <h2 className={styles.sectionTitle}>Featured opportunities</h2>
            <p className={styles.sectionText}>
              A selection of our current openings. Use the full job search to filter
              by department, location, or experience level.
            </p>
          </div>

          <div className={styles.jobsPreviewGrid}>
            {featuredJobs.map((job) => (
              <article key={job.id} className={styles.jobPreviewCard}>
                <div className={styles.jobMeta}>
                  <span className={styles.jobTag}>{job.department}</span>
                  <span className={styles.jobTagType}>{job.type}</span>
                </div>
                <h3 className={styles.jobTitle}>{job.title}</h3>
                <p className={styles.jobLocation}>
                  <i className="fas fa-location-dot" aria-hidden="true" />
                  {job.location}
                </p>
                <p className={styles.jobDesc}>{job.description}</p>
                <Link href="/careers/jobs" className={styles.jobArrow}>
                  View Details <i className="fas fa-arrow-right" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <Button href="/careers/jobs">Search All Jobs</Button>
          </div>
        </div>
      </section>

      {/* ── Next Steps ────────────────────────────────── */}
      <NextSteps />
    </>
  );
}
