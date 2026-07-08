import type { Metadata } from "next";
import Countdown from "./Countdown";
import ApplyButton from "./ApplyButton";
import FaqAccordion from "./FaqAccordion";
import {
  detailCards,
  vaptWeeks,
  socWeeks,
  selectionSteps,
  criteria,
  timelineItems,
  benefits,
  type Week,
} from "./data";
import styles from "./internship.module.css";

export const metadata: Metadata = {
  title: "Rynex Security Internship Program 2026",
  description:
    "Apply for the Rynex Security Internship Program 2026 — a six-week remote cybersecurity internship with Red Team (VAPT) and Blue Team (SOC) tracks starting 11 July 2026.",
};

function TrackCard({ tagColor, tagLabels, title, subtitle, weeks }: { tagColor: "red" | "blue"; tagLabels: string[]; title: string; subtitle: string; weeks: Week[] }) {
  return (
    <article className={styles.trackCard}>
      <div className={styles.trackHeader}>
        {tagLabels.map((label) => (
          <span key={label} className={`${styles.trackTag} ${tagColor === "red" ? styles.trackTagRed : styles.trackTagBlue}`}>
            {label}
          </span>
        ))}
      </div>
      <h3 className={styles.trackTitle}>{title}</h3>
      <p className={styles.trackSubtitle}>{subtitle}</p>
      <div className={styles.weekList}>
        {weeks.map((week) => (
          <div key={week.when} className={styles.weekItem}>
            <div className={styles.weekTop}>
              <h4>{week.when}</h4>
              <span className={styles.weekLabel}>{week.label}</span>
            </div>
            <div className={styles.weekTitle}>{week.title}</div>
            <ul className={styles.topicList}>
              {week.topics.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className={styles.weekEngagement}>{week.engagement}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function InternshipPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Cybersecurity Internship Program 2026</h1>
          <Countdown target="2026-07-11T00:00:00" label="Program starts in" />
          <ApplyButton variant="onDark" />
        </div>
      </section>

      <section id="details" className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Learn . Practice . Secure</h2>
            <p className={styles.sectionText}>
              Build practical skills. Work on real-world tasks. Grow your cybersecurity career
              with Rynex Security — a six-week remote internship designed for students and fresh
              graduates who are serious about breaking into the field.
            </p>
          </div>
          <div className={styles.detailGrid}>
            {detailCards.map((card) => (
              <div key={card.title} className={styles.detailCard}>
                <h4>{card.title}</h4>
                <p>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="curriculum" className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <p className={styles.sectionEyebrow}>Curriculum</p>
            <h2 className={styles.sectionTitle}>Curriculum &amp; Learning Tracks</h2>
            <p className={styles.sectionText}>
              Two parallel paths run simultaneously. Each track delivers focused sessions every
              weekend, paired with a weekly hands-on challenge. Week 6 culminates in a capstone
              operation evaluated by the Rynex Security team.
            </p>
          </div>
          <div className={styles.trackGrid}>
            <TrackCard
              tagColor="red"
              tagLabels={["Red Team", "Penetration Testing"]}
              title="VAPT — Vulnerability Assessment & Penetration Testing"
              subtitle="Identify, exploit, and report vulnerabilities in systems and applications using offensive security methodologies aligned with industry standards."
              weeks={vaptWeeks}
            />
            <TrackCard
              tagColor="blue"
              tagLabels={["Blue Team", "Security Operations"]}
              title="SOC — Security Operations Center"
              subtitle="Monitor, detect, and respond to security incidents using defensive methodologies, threat intelligence, and industry-standard tools."
              weeks={socWeeks}
            />
          </div>
        </div>
      </section>

      <section id="selection" className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <p className={styles.sectionEyebrow}>Selection</p>
            <h2 className={styles.sectionTitle}>Selection Process &amp; Criteria</h2>
            <p className={styles.sectionText}>
              We take every application seriously. Our process is structured but approachable —
              rejections are rare, reserved only for candidates with zero relevance to technology
              or cybersecurity.
            </p>
          </div>
          <div className={styles.selectionGrid}>
            {selectionSteps.map((s) => (
              <div key={s.step} className={styles.selectionStep}>
                <h4>{s.step}</h4>
                <strong>{s.title}</strong>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
          <div className={styles.criteriaBox}>
            <h4>What We Look For</h4>
            <ul>
              {criteria.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="timeline" className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <p className={styles.sectionEyebrow}>Timeline</p>
            <h2 className={styles.sectionTitle}>From Application to Certificate</h2>
            <p className={styles.sectionText}>
              Here is the complete timeline of the Rynex Security Internship Program 2026 — from
              your first click on the application form to the certificate in your hands.
            </p>
          </div>
          <div className={styles.timeline}>
            {timelineItems.map((t) => (
              <article key={t.step} className={styles.timelineItem}>
                <strong>{t.when}</strong>
                <div>
                  <h4>{t.title}</h4>
                  <p>{t.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="benefits" className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <p className={styles.sectionEyebrow}>Benefits</p>
            <h2 className={styles.sectionTitle}>Program Benefits</h2>
            <p className={styles.sectionText}>
              Beyond the learning — here is what you walk away with after six weeks at Rynex
              Security.
            </p>
          </div>
          <div className={styles.benefitGrid}>
            {benefits.map((b) => (
              <div key={b.title} className={styles.benefitCard}>
                <i className={`fas ${b.icon} ${styles.benefitIcon}`} aria-hidden="true" />
                <h4>{b.title}</h4>
                <p>{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <p className={styles.sectionEyebrow}>FAQ</p>
            <h2 className={styles.sectionTitle}>Frequently Asked</h2>
            <p className={styles.sectionText}>
              Everything you need to know before applying. Still have questions? Drop them in
              our Discord server and the team will respond.
            </p>
          </div>
          <FaqAccordion />
        </div>
      </section>

      <section className={styles.section} style={{ textAlign: "center" }}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Ready to apply?</h2>
          <p className={styles.sectionText} style={{ margin: "0 auto var(--sp-07)", maxWidth: "50ch" }}>
            Submit your application and our team will review it as soon as possible.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ApplyButton />
          </div>
        </div>
      </section>
    </>
  );
}
