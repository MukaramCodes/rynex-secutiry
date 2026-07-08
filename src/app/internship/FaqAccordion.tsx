"use client";

import { useState } from "react";
import { faqs } from "./data";
import styles from "./internship.module.css";

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={styles.faqList}>
      {faqs.map((item, i) => (
        <div key={item.q} className={`${styles.faqItem} ${openIndex === i ? styles.faqItemOpen : ""}`}>
          <button
            type="button"
            className={styles.faqQuestion}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            aria-expanded={openIndex === i}
          >
            <h4>{item.q}</h4>
            <span aria-hidden="true">+</span>
          </button>
          <div className={styles.faqAnswer}>
            <div className={styles.faqAnswerInner}>
              <p>{item.a}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
