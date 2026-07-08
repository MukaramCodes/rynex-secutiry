"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./GoogleTranslate.module.css";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (options: Record<string, unknown>, elementId: string) => unknown;
      };
    };
  }
}

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ur", label: "Urdu — اردو" },
  { code: "ar", label: "Arabic — العربية" },
  { code: "es", label: "Spanish — Español" },
  { code: "fr", label: "French — Français" },
  { code: "de", label: "German — Deutsch" },
  { code: "zh-CN", label: "Chinese (Simplified) — 中文" },
  { code: "hi", label: "Hindi — हिन्दी" },
  { code: "pt", label: "Portuguese — Português" },
  { code: "ru", label: "Russian — Русский" },
  { code: "ja", label: "Japanese — 日本語" },
  { code: "tr", label: "Turkish — Türkçe" },
  { code: "id", label: "Indonesian — Bahasa Indonesia" },
  { code: "bn", label: "Bengali — বাংলা" },
];

let scriptLoadStarted = false;

export default function GoogleTranslate() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("en");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scriptLoadStarted) return;
    scriptLoadStarted = true;

    window.googleTranslateElementInit = () => {
      if (window.google) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", autoDisplay: false },
          "google_translate_element"
        );
      }
    };

    const script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, []);

  function selectLanguage(code: string) {
    setCurrent(code);
    setOpen(false);

    const trySelect = (attemptsLeft: number) => {
      const select = document.querySelector<HTMLSelectElement>("select.goog-te-combo");
      if (select) {
        select.value = code;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      } else if (attemptsLeft > 0) {
        setTimeout(() => trySelect(attemptsLeft - 1), 300);
      }
    };
    trySelect(15);
  }

  const currentCode = current.split("-")[0].toUpperCase();

  return (
    <div className={`${styles.wrapper} notranslate`} ref={wrapperRef} translate="no">
      <div id="google_translate_element" style={{ display: "none" }} />
      <button
        type="button"
        className={styles.iconBtn}
        aria-label={`Change language, currently ${current === "en" ? "English (default)" : current}`}
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        <i className="fas fa-globe" aria-hidden="true" />
        <span className={styles.langCode}>{currentCode}</span>
      </button>
      {open && (
        <div className={styles.menu}>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              className={`${styles.menuItem} ${current === lang.code ? styles.active : ""}`}
              onClick={() => selectLanguage(lang.code)}
            >
              {lang.label}
              {lang.code === "en" && <span className={styles.defaultTag}>Default</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
