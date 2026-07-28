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
  { code: "ar", label: "Arabic — العربية" },
  { code: "ru", label: "Russian — Русский" },
  { code: "fr", label: "French — Français" },
  { code: "de", label: "German — Deutsch" },
  { code: "zh-CN", label: "Chinese (Simplified) — 中文" },
  { code: "hi", label: "Hindi — हिन्दी" },
  { code: "pt", label: "Portuguese — Português" },
  { code: "ja", label: "Japanese — 日本語" },
  { code: "tr", label: "Turkish — Türkçe" },
  { code: "id", label: "Indonesian — Bahasa Indonesia" },
  { code: "bn", label: "Bengali — বাংলা" },
];

// ISO 3166-1 alpha-2 Country Code to Language mapping
const COUNTRY_TO_LANG: Record<string, string> = {
  AE: "ar", SA: "ar", EG: "ar", QA: "ar", KW: "ar", OM: "ar", BH: "ar", JO: "ar", LB: "ar", IQ: "ar", MA: "ar", DZ: "ar", TN: "ar", LY: "ar", SD: "ar", YE: "ar",
  RU: "ru", BY: "ru", KZ: "ru", KG: "ru",
  FR: "fr", BE: "fr", MC: "fr", SN: "fr", CI: "fr", MG: "fr",
  DE: "de", AT: "de", LI: "de", LU: "de",
  CN: "zh-CN", TW: "zh-CN", HK: "zh-CN", SG: "zh-CN",
  IN: "hi",
  BR: "pt", PT: "pt", AO: "pt", MZ: "pt",
  JP: "ja",
  TR: "tr",
  ID: "id",
  BD: "bn",
};

// Browser locale prefix mapping
const BROWSER_LOCALE_TO_LANG: Record<string, string> = {
  ar: "ar",
  ru: "ru",
  fr: "fr",
  de: "de",
  zh: "zh-CN",
  hi: "hi",
  pt: "pt",
  ja: "ja",
  tr: "tr",
  id: "id",
  bn: "bn",
};

let scriptLoadStarted = false;

export default function GoogleTranslate() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("en");
  const wrapperRef = useRef<HTMLDivElement>(null);

  function applyLanguage(code: string, isManual = true) {
    setCurrent(code);
    setOpen(false);
    if (isManual) {
      localStorage.setItem("rynex-user-lang", code);
    }

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

  useEffect(() => {
    // Check saved or detected language on mount
    detectAndApplyLanguage();

    if (scriptLoadStarted) return;
    scriptLoadStarted = true;

    window.googleTranslateElementInit = () => {
      if (window.google) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", autoDisplay: false },
          "google_translate_element"
        );

        // Apply detected or saved language after widget initializes
        detectAndApplyLanguage();
      }
    };

    const script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  async function detectAndApplyLanguage() {
    // 1. Check manual preference
    const savedUserLang = localStorage.getItem("rynex-user-lang");
    if (savedUserLang) {
      applyLanguage(savedUserLang, false);
      return;
    }

    // 2. Browser locale detection
    const browserLang = (navigator.language || (navigator as any).userLanguage || "").toLowerCase();
    const langPrefix = browserLang.split("-")[0];
    if (langPrefix && BROWSER_LOCALE_TO_LANG[langPrefix]) {
      applyLanguage(BROWSER_LOCALE_TO_LANG[langPrefix], false);
      return;
    }

    // 3. IP Geolocation Country Detection
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const countryCode = (data.country_code || data.country || "").toUpperCase();
        if (countryCode && COUNTRY_TO_LANG[countryCode]) {
          applyLanguage(COUNTRY_TO_LANG[countryCode], false);
        }
      }
    } catch {
      // Fallback silently if offline or request blocked
    }
  }

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, []);

  const currentCode = current.split("-")[0].toUpperCase();

  return (
    <div className={`${styles.wrapper} notranslate`} ref={wrapperRef} translate="no" suppressHydrationWarning>
      <div id="google_translate_element" style={{ display: "none" }} suppressHydrationWarning />
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
              onClick={() => applyLanguage(lang.code, true)}
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
