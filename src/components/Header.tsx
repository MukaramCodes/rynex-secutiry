"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./Header.module.css";
import { services } from "@/lib/site-data";
import SearchOverlay from "./SearchOverlay";
import GoogleTranslate from "./GoogleTranslate";
import NavLogo from "./NavLogo";

const internshipLinks = [
  {
    href: "/internship#curriculum",
    title: "Curriculum & Tracks",
    desc: "Red Team (VAPT) and Blue Team (SOC) learning paths.",
    enabled: false,
  },
  {
    href: "/internship#selection",
    title: "Selection Process",
    desc: "How applications are reviewed and shortlisted.",
    enabled: false,
  },
  {
    href: "/internship#timeline",
    title: "Program Timeline",
    desc: "From application to certificate.",
    enabled: false,
  },
  {
    href: "/internship#benefits",
    title: "Program Benefits",
    desc: "What you walk away with after six weeks.",
    enabled: false,
  },
  {
    href: "/internship#faq",
    title: "Frequently Asked",
    desc: "Everything you need to know before applying.",
    enabled: false,
  },
  {
    href: "/internship",
    title: "Apply Now",
    desc: "Start your internship application.",
    enabled: false,
  },
];

export default function Header() {
  const pathname = usePathname();

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);

  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("rynex-theme");
    if (savedTheme === "light") {
      setIsDarkMode(false);
      document.documentElement.removeAttribute("data-theme");
    } else {
      setIsDarkMode(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("rynex-theme", "dark");
      } else {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("rynex-theme", "light");
      }
      return next;
    });
  };

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const shouldLock = mobileOpen;
    if (shouldLock) {
      // Lock body scroll and prevent scroll-chaining on iOS / Android
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(null);
      }
    }

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  function closeNavigation() {
    setOpenMenu(null);
    setMobileOpen(false);
  }

  const effectiveDark = mounted ? isDarkMode : true;

  return (
    <header ref={headerRef} className={styles.header} suppressHydrationWarning>
      <div className={styles.bar} suppressHydrationWarning>
        <Link href="/" className={styles.logo}>
          <NavLogo />
          Rynex Security
        </Link>

        <button
          type="button"
          className={styles.hamburger}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((current) => !current)}
        >
          <i
            className={`fas ${mobileOpen ? "fa-times" : "fa-bars"}`}
            aria-hidden="true"
          />
        </button>

        <nav
          className={`${styles.nav} ${
            mobileOpen ? styles.navOpen : ""
          }`}
          suppressHydrationWarning
        >
          <div className={styles.navItem} suppressHydrationWarning>
            <Link
              href="/"
              className={`${styles.navLink} ${
                pathname === "/" ? styles.active : ""
              }`}
              onClick={closeNavigation}
            >
              Home
            </Link>
          </div>

          <div className={styles.navItem}>
            <Link
              href="/about"
              className={`${styles.navLink} ${
                isActive("/about") ? styles.active : ""
              }`}
              onClick={closeNavigation}
            >
              About
            </Link>
          </div>

          <div
            className={`${styles.navItem} ${
              openMenu === "services" ? styles.open : ""
            }`}
          >
            <button
              type="button"
              className={`${styles.navLink} ${
                isActive("/services") ? styles.active : ""
              }`}
              aria-expanded={openMenu === "services"}
              onClick={(event) => {
                event.stopPropagation();

                setOpenMenu((current) =>
                  current === "services" ? null : "services",
                );
              }}
            >
              Services{" "}
              <i
                className={`fas fa-chevron-down ${styles.chevron}`}
                aria-hidden="true"
              />
            </button>

            {openMenu === "services" && (
              <div className={styles.megaMenu}>
                <div className={styles.megaGrid}>
                {services.map((service) => (
  <Link
    key={service.slug}
    href={`/services/${service.slug}`}
    className={styles.megaLink}
    onClick={closeNavigation}
  >
                      <div className={styles.megaLinkTitle}>
                        <i
                          className={`fas ${service.icon}`}
                          aria-hidden="true"
                        />
                        {service.title}
                      </div>

                      <div className={styles.megaLinkDesc}>
                        {service.shortDescription}
                      </div>
                    </Link>
                  ))}
                </div>

                <div className={styles.megaFooter}>
                  <Link
                    href="/services"
                    className={styles.megaLink}
                    onClick={closeNavigation}
                  >
                    <div
                      className={styles.megaLinkTitle}
                      style={{ color: "var(--ibm-blue-60)" }}
                    >
                      View all services{" "}
                      <i
                        className="fas fa-arrow-right"
                        aria-hidden="true"
                      />
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className={styles.navItem}>
            <Link
              href="/blog"
              className={`${styles.navLink} ${
                isActive("/blog") ? styles.active : ""
              }`}
              onClick={closeNavigation}
            >
              Blog
            </Link>
          </div>

          <div className={styles.navItem}>
            <Link
              href="/careers"
              className={`${styles.navLink} ${
                isActive("/careers") ? styles.active : ""
              }`}
              onClick={closeNavigation}
            >
              Careers
            </Link>
          </div>

          <div className={styles.navItem}>
            <Link
              href="/events"
              className={`${styles.navLink} ${
                isActive("/events") ? styles.active : ""
              }`}
              onClick={closeNavigation}
            >
              Events
            </Link>
          </div>

          {/* 
          INTERNSHIP NAV ITEM (Temporarily disabled - uncomment to re-enable in header):
          <div className={styles.navItem}>
            <Link
              href="/internship"
              className={`${styles.navLink} ${isActive("/internship") ? styles.active : ""}`}
              onClick={closeNavigation}
            >
              Internship
            </Link>
          </div>
          */}

          <div className={styles.navItem}>
            <Link
              href="/contact"
              className={`${styles.navLink} ${
                isActive("/contact") ? styles.active : ""
              }`}
              onClick={closeNavigation}
            >
              Contact
            </Link>
          </div>
        </nav>

        <div className={styles.utilities} suppressHydrationWarning>
          <button
            type="button"
            className={styles.iconBtn}
            aria-label="Toggle Theme"
            title={effectiveDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            onClick={toggleTheme}
            suppressHydrationWarning
          >
            <i className={`fas ${effectiveDark ? "fa-sun" : "fa-moon"}`} aria-hidden="true" />
          </button>

          <GoogleTranslate />
        </div>
      </div>

      {searchOpen && (
        <SearchOverlay onClose={() => setSearchOpen(false)} />
      )}
    </header>
  );
}