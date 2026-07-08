"use client";

import { useState } from "react";
import Button from "@/components/Button";
import styles from "./contact.module.css";

type Status = { type: "idle" | "success" | "error"; message: string };

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: "idle", message: "" });

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: "Message sent — we'll respond within 24 hours." });
        form.reset();
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
    <form className={styles.formCard} onSubmit={handleSubmit}>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", opacity: 0 }}
      />

      <div className={styles.fieldRow}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="name">Name</label>
          <input className={styles.input} type="text" id="name" name="name" placeholder="Your name" required />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="email">Email</label>
          <input className={styles.input} type="email" id="email" name="email" placeholder="your@email.com" required />
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="inquiryType">Inquiry Type</label>
        <select className={styles.select} id="inquiryType" name="inquiryType" defaultValue="general">
          <option value="general">General Inquiry</option>
          <option value="consultation">Security Consultation (VAPT / SOC / GRC)</option>
          <option value="partnership">Strategic Partnership</option>
          <option value="careers">Careers / Internship</option>
          <option value="media">Media &amp; Press</option>
        </select>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="subject">Subject</label>
        <input
          className={styles.input}
          type="text"
          id="subject"
          name="subject"
          placeholder="e.g. VAPT consultation, SOC enquiry..."
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="message">Message</label>
        <textarea
          className={styles.textarea}
          id="message"
          name="message"
          rows={5}
          placeholder="How can we help secure your business?"
          required
        />
      </div>

      <Button type="submit" icon="fa-paper-plane" disabled={submitting}>
        {submitting ? "Sending..." : "Send Message"}
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
