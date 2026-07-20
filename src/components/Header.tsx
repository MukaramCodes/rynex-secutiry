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

  if (pathname.startsWith('/portal')) return null;

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

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

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles.bar}>
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
        >
          <div className={styles.navItem}>
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

          <div
            className={`${styles.navItem} ${
              openMenu === "internship" ? styles.open : ""
            }`}
          >
            <button
              type="button"
              className={`${styles.navLink} ${
                isActive("/internship") ? styles.active : ""
              }`}
              aria-expanded={openMenu === "internship"}
              onClick={(event) => {
                event.stopPropagation();

                setOpenMenu((current) =>
                  current === "internship" ? null : "internship",
                );
              }}
            >
              Internship{" "}
              <i
                className={`fas fa-chevron-down ${styles.chevron}`}
                aria-hidden="true"
              />
            </button>

            {openMenu === "internship" && (
              <div className={styles.megaMenu}>
                <div className={styles.megaGrid}>
                  {internshipLinks.map((item) => {
                    if (!item.enabled) {
                      return (
                        <div
                          key={item.href}
                          className={`${styles.megaLink} ${styles.disabledInternshipLink}`}
                          aria-disabled="true"
                          title="This section is currently unavailable"
                        >
                          <div className={styles.internshipTitleBlock}>
                            <span className={styles.internshipItemTitle}>
                              {item.title}
                            </span>

                            <span className={styles.comingSoon}>
                              Coming soon
                            </span>
                          </div>

                          <div className={styles.megaLinkDesc}>
                            {item.desc}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.megaLink} ${styles.enabledInternshipLink}`}
                        onClick={closeNavigation}
                      >
                        <div className={styles.megaLinkTitle}>
                          {item.title}
                        </div>

                        <div className={styles.megaLinkDesc}>
                          {item.desc}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

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

      {searchOpen && (
        <SearchOverlay onClose={() => setSearchOpen(false)} />
      )}
    </header>
  );
}