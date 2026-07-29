'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './EventPopup.module.css';

export default function EventPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show after a short delay so the page renders first
    const t = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.overlay} onClick={dismiss} role="dialog" aria-modal="true" aria-label="Upcoming event announcement">
      <div className={styles.card} onClick={e => e.stopPropagation()}>

        {/* Glowing background accents */}
        <div className={styles.glowTL} aria-hidden="true" />
        <div className={styles.glowBR} aria-hidden="true" />

        {/* Close */}
        <button type="button" className={styles.closeBtn} onClick={dismiss} aria-label="Close popup">
          <i className="fas fa-times" aria-hidden="true" />
        </button>

        {/* Badge */}
        <div className={styles.badge}>
          <span className={styles.pulseDot} aria-hidden="true" />
          FLAGSHIP EVENT 2026
        </div>

        {/* Event name */}
        <div className={styles.eventName}>RYNEX ECLIPSE</div>
        <div className={styles.subtitle}>Think · Capture · Compete</div>

        {/* Stats row */}
        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <i className="fas fa-location-dot" aria-hidden="true" />
            <span>Rahim Yar Khan, PK</span>
          </div>
          <div className={styles.statDivider} aria-hidden="true" />
          <div className={styles.stat}>
            <i className="fas fa-flag" aria-hidden="true" />
            <span>Jeopardy CTF</span>
          </div>
          <div className={styles.statDivider} aria-hidden="true" />
          <div className={styles.stat}>
            <i className="fas fa-users" aria-hidden="true" />
            <span>200+ Competitors</span>
          </div>
          <div className={styles.statDivider} aria-hidden="true" />
          <div className={styles.stat}>
            <i className="fas fa-ticket" aria-hidden="true" />
            <span>PKR 500</span>
          </div>
        </div>

        {/* Description */}
        <p className={styles.desc}>
          Pakistan's premier Capture The Flag competition. Join top students, ethical hackers,
          SOC analysts, and security researchers competing for cash prizes, trophies, and direct
          recruitment opportunities with leading cybersecurity firms.
        </p>

        {/* Challenge tracks mini-grid */}
        <div className={styles.tracksGrid}>
          {[
            { icon: 'fa-globe',          label: 'Web Exploitation' },
            { icon: 'fa-magnifying-glass', label: 'Digital Forensics' },
            { icon: 'fa-gears',          label: 'Reverse Engineering' },
            { icon: 'fa-network-wired',  label: 'Network Security' },
          ].map(t => (
            <div key={t.label} className={styles.track}>
              <i className={`fas ${t.icon}`} aria-hidden="true" />
              <span>{t.label}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className={styles.ctaRow}>
          <Link href="/events" className={styles.primaryCta} onClick={dismiss}>
            <i className="fas fa-user-plus" aria-hidden="true" />
            Register Now — PKR 500
          </Link>
          <button type="button" className={styles.secondaryCta} onClick={dismiss}>
            Maybe Later
          </button>
        </div>

      </div>
    </div>
  );
}
