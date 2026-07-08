"use client";

import { useRef } from "react";
import styles from "./WhoWeAreVisual.module.css";

const features = [
  { icon: "fa-shield-halved", title: "Experts", text: "Certified security professionals" },
  { icon: "fa-bullseye", title: "Focused", text: "Focused on finding what matters" },
  { icon: "fa-magnifying-glass", title: "Transparent", text: "Clear reports. Actionable insights." },
  { icon: "fa-chart-line", title: "Committed", text: "Committed to your security and growth" },
];

export default function WhoWeAreVisual() {
  const panelRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const panel = panelRef.current;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    const xOffset = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 10;
    const yOffset = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * 10;
    panel.style.setProperty("--mx", `${xPct}%`);
    panel.style.setProperty("--my", `${yPct}%`);
    panel.style.setProperty("--tx", `${xOffset}px`);
    panel.style.setProperty("--ty", `${yOffset}px`);
  }

  function handleMouseLeave() {
    const panel = panelRef.current;
    if (!panel) return;
    panel.style.setProperty("--mx", "50%");
    panel.style.setProperty("--my", "50%");
    panel.style.setProperty("--tx", "0px");
    panel.style.setProperty("--ty", "0px");
  }

  return (
    <div
      ref={panelRef}
      className={styles.panel}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.floatIcons} aria-hidden="true">
        <i className={`fas fa-shield-halved ${styles.floatIcon} ${styles.i1}`} />
        <i className={`fas fa-lock ${styles.floatIcon} ${styles.i2}`} />
        <i className={`fas fa-users ${styles.floatIcon} ${styles.i3}`} />
        <i className={`fas fa-server ${styles.floatIcon} ${styles.i4}`} />
      </div>
      <i className={`fas fa-globe ${styles.globeMark}`} aria-hidden="true" />

      <div className={styles.content}>
        <h3 className={styles.heading}>
          WHO <span className={styles.accent}>WE ARE</span>
        </h3>

        <div className={styles.featureGrid}>
          {features.map((f) => (
            <div key={f.title} className={styles.feature}>
              <i className={`fas ${f.icon}`} aria-hidden="true" />
              <h4>{f.title}</h4>
              <p>{f.text}</p>
            </div>
          ))}
        </div>

        <div className={styles.terminal}>
          <div className={styles.terminalHeader}>
            <span className={styles.terminalLabel}>
              <i className="fas fa-terminal" aria-hidden="true" /> LIVE_OPERATIONS
            </span>
            <span className={styles.terminalId}>ID: RX-VAPT-01</span>
          </div>
          <div className={styles.terminalBody}>
            <div className={styles.terminalRow}>
              <span>MODE:</span>
              <span className={styles.terminalValue}>OFFENSIVE_RECON</span>
            </div>
            <div className={styles.terminalRow}>
              <span>SCOPE:</span>
              <span className={styles.terminalValue}>FULL_STACK_ASSESSMENT</span>
            </div>
            <div className={styles.terminalRow}>
              <span>TEAM:</span>
              <span className={styles.terminalValue}>RED_TEAM / BLUE_TEAM</span>
            </div>
          </div>
          <div className={styles.terminalDivider} />
          <div className={styles.terminalStatus}>
            <span className={styles.statusDot} aria-hidden="true" />
            SOC_STATUS: MONITORING_ACTIVE
          </div>
        </div>
      </div>
    </div>
  );
}
