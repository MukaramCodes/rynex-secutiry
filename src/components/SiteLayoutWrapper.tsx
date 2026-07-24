"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SiteLayoutWrapper({
  children,
  isPortalHost,
}: {
  children: React.ReactNode;
  isPortalHost?: boolean;
}) {
  const pathname = usePathname();

  // Hide the public header/footer if the current route is within the portal
  const isPortalPath = pathname?.startsWith("/portal") || pathname === "/login" || pathname === "/change-password";
  const isPortal = isPortalHost || isPortalPath;

  useEffect(() => {
    if (isPortal) {
      const savedTheme = localStorage.getItem("rynex-theme");
      // Default to dark/black mode in the portal if no theme preference is saved
      if (!savedTheme || savedTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        if (!savedTheme) {
          localStorage.setItem("rynex-theme", "dark");
        }
      }
    }
  }, [isPortal]);

  return (
    <>
      {!isPortal && <Header />}
      {children}
      {!isPortal && <Footer />}
    </>
  );
}
