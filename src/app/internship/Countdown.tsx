"use client";

import { useEffect, useState } from "react";
import styles from "./internship.module.css";

function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown({ target, label }: { target: string; label: string }) {
  const targetDate = new Date(target);
  const [time, setTime] = useState(() => getTimeLeft(targetDate));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div>
      <p className={styles.countdownLabel}>{label}</p>
      <div className={styles.countdown}>
        <div className={styles.timeBox}>
          <strong>{pad(time.days)}</strong>
          <span>Days</span>
        </div>
        <div className={styles.timeBox}>
          <strong>{pad(time.hours)}</strong>
          <span>Hours</span>
        </div>
        <div className={styles.timeBox}>
          <strong>{pad(time.minutes)}</strong>
          <span>Minutes</span>
        </div>
        <div className={styles.timeBox}>
          <strong>{pad(time.seconds)}</strong>
          <span>Seconds</span>
        </div>
      </div>
    </div>
  );
}
