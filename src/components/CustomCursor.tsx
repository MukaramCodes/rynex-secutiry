"use client";

import { useEffect, useRef } from "react";
import styles from "./CustomCursor.module.css";

const INTERACTIVE_SELECTOR = "a, button, input, textarea, select, [role='button']";

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const ring = ringRef.current;
    if (!ring) return;

    document.documentElement.classList.add("cursor-none");
    ring.style.opacity = "1";

    function handleMove(e: MouseEvent) {
      if (!ring) return;
      ring.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      const target = e.target as HTMLElement | null;
      const isInteractive = !!target?.closest(INTERACTIVE_SELECTOR);
      ring.classList.toggle(styles.hover, isInteractive);
    }

    function handleLeaveWindow() {
      if (ring) ring.style.opacity = "0";
    }
    function handleEnterWindow() {
      if (ring) ring.style.opacity = "1";
    }

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseleave", handleLeaveWindow);
    document.addEventListener("mouseenter", handleEnterWindow);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeaveWindow);
      document.removeEventListener("mouseenter", handleEnterWindow);
      document.documentElement.classList.remove("cursor-none");
    };
  }, []);

  return <div ref={ringRef} className={styles.ring} aria-hidden="true" />;
}
