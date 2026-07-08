"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";
import { services } from "@/lib/site-data";
import SearchOverlay from "./SearchOverlay";
import GoogleTranslate from "./GoogleTranslate";

const internshipLinks = [
  { href: "/internship#curriculum", title: "Curriculum & Tracks", desc: "Red Team (VAPT) and Blue Team (SOC) learning paths." },
  { href: "/internship#selection", title: "Selection Process", desc: "How applications are reviewed and shortlisted." },
  { href: "/internship#timeline", title: "Program Timeline", desc: "From application to certificate." },
  { href: "/internship#benefits", title: "Program Benefits", desc: "What you walk away with after six weeks." },
  { href: "/internship#faq", title: "Frequently Asked", desc: "Everything you need to know before applying." },
  { href: "/internship", title: "Apply Now", desc: "Start your internship application." },
];

export default function Header() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpenMenu(null);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className={styles.header} ref={headerRef}>
      <div className={styles.bar}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/images/logo.png"
            alt="Rynex Security Logo"
            width={22}
            height={22}
            className="logoAnimated"
          />
          Rynex Security
        </Link>

        <button
          type="button"
          className={styles.hamburger}
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <i className={`fas ${mobileOpen ? "fa-times" : "fa-bars"}`} aria-hidden="true" />
        </button>

        <nav className={`${styles.nav} ${mobileOpen ? styles.navOpen : ""}`}>
          <div className={styles.navItem}>
            <Link href="/" className={`${styles.navLink} ${isActive("/") && pathname === "/" ? styles.active : ""}`}>
              Home
            </Link>
          </div>

          <div className={styles.navItem}>
            <Link href="/about" className={`${styles.navLink} ${isActive("/about") ? styles.active : ""}`}>
              About
            </Link>
          </div>

          <div className={`${styles.navItem} ${openMenu === "services" ? styles.open : ""}`}>
            <button
              type="button"
              className={`${styles.navLink} ${isActive("/services") ? styles.active : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu(openMenu === "services" ? null : "services");
              }}
              aria-expanded={openMenu === "services"}
            >
              Services <i className={`fas fa-chevron-down ${styles.chevron}`} aria-hidden="true" />
            </button>
            {openMenu === "services" && (
              <div className={styles.megaMenu}>
                <div className={styles.megaGrid}>
                  {services.map((s) => (
                    <Link key={s.slug} href="/services" className={styles.megaLink}>
                      <div className={styles.megaLinkTitle}>
                        <i className={`fas ${s.icon}`} aria-hidden="true" />
                        {s.title}
                      </div>
                      <div className={styles.megaLinkDesc}>{s.shortDescription}</div>
                    </Link>
                  ))}
                </div>
                <div className={styles.megaFooter}>
                  <Link href="/services" className={styles.megaLink}>
                    <div className={styles.megaLinkTitle} style={{ color: "var(--ibm-blue-60)" }}>
                      View all services <i className="fas fa-arrow-right" aria-hidden="true" />
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className={styles.navItem}>
            <Link href="/blog" className={`${styles.navLink} ${isActive("/blog") ? styles.active : ""}`}>
              Blog
            </Link>
          </div>

          <div className={`${styles.navItem} ${openMenu === "internship" ? styles.open : ""}`}>
            <button
              type="button"
              className={`${styles.navLink} ${isActive("/internship") ? styles.active : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu(openMenu === "internship" ? null : "internship");
              }}
              aria-expanded={openMenu === "internship"}
            >
              Internship <i className={`fas fa-chevron-down ${styles.chevron}`} aria-hidden="true" />
            </button>
            {openMenu === "internship" && (
              <div className={styles.megaMenu}>
                <div className={styles.megaGrid}>
                  {internshipLinks.map((l) => (
                    <Link key={l.href} href={l.href} className={styles.megaLink}>
                      <div className={styles.megaLinkTitle}>{l.title}</div>
                      <div className={styles.megaLinkDesc}>{l.desc}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.navItem}>
            <Link href="/contact" className={`${styles.navLink} ${isActive("/contact") ? styles.active : ""}`}>
              Contact
            </Link>
          </div>
        </nav>

        <div className={styles.utilities}>
          <button
            type="button"
            className={styles.iconBtn}
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            <i className="fas fa-search" aria-hidden="true" />
          </button>
          <GoogleTranslate />
        </div>
      </div>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </header>
  );
}
