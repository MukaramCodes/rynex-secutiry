"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./SearchOverlay.module.css";
import type { SearchResult } from "@/lib/search-index";

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    if (!query.trim()) return;

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      }
    }, 200);
    return () => clearTimeout(timeout);
  }, [query]);

  const displayResults = query.trim() ? results : [];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.inputRow}>
          <i className="fas fa-search" aria-hidden="true" />
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            placeholder="Search Rynex Security — services, blog, pages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search site"
          />
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close search">
            <i className="fas fa-times" aria-hidden="true" />
          </button>
        </div>
        <div className={styles.results}>
          {query.trim() && displayResults.length === 0 && (
            <p className={styles.empty}>No results for &quot;{query}&quot;</p>
          )}
          {displayResults.map((r, i) => (
            <Link key={`${r.href}-${i}`} href={r.href} className={styles.resultLink} onClick={onClose}>
              <div className={styles.resultType}>{r.type}</div>
              <div className={styles.resultTitle}>{r.title}</div>
              <div className={styles.resultDesc}>{r.description}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
