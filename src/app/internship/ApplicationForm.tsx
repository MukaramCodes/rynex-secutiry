"use client";

import { useState } from "react";
import Button from "@/components/Button";
import styles from "./internship.module.css";

type Status = { type: "idle" | "success" | "error"; message: string };

export default function ApplicationForm({ onSuccess }: { onSuccess?: () => void }) {
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: "idle", message: "" });

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/internship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: "Application received — we'll be in touch soon." });
        form.reset();
        onSuccess?.();
      } else {
        setStatus({ type: "error", message: json.error ?? "Something went wrong. Please try again." });
      }
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", opacity: 0 }}
      />

      <div className={styles.formRow}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="fullName">Full name</label>
          <input className={styles.input} type="text" id="fullName" name="fullName" placeholder="Your full name" required />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="email">Email</label>
          <input className={styles.input} type="email" id="email" name="email" placeholder="your@email.com" required />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="track">Preferred track</label>
          <select className={styles.select} id="track" name="track" required defaultValue="">
            <option value="" disabled>Select a track</option>
            <option value="VAPT">Red Team — VAPT</option>
            <option value="SOC">Blue Team — SOC</option>
            <option value="No preference">No preference</option>
          </select>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="education">University / education</label>
          <input className={styles.input} type="text" id="education" name="education" placeholder="e.g. BS Computer Science, FAST-NUCES" />
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="resumeLink">Resume / LinkedIn link</label>
        <input className={styles.input} type="url" id="resumeLink" name="resumeLink" placeholder="https://..." />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="message">Why do you want to join Rynex Security?</label>
        <textarea
          className={styles.textarea}
          id="message"
          name="message"
          rows={4}
          placeholder="Tell us briefly about your interest and experience"
          required
        />
      </div>

      <Button type="submit" icon="fa-paper-plane" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Application"}
      </Button>

      <p
        className={`${styles.status} ${
          status.type === "success" ? styles.statusSuccess : status.type === "error" ? styles.statusError : ""
        }`}
      >
        {status.message}
      </p>
    </form>
  );
}
