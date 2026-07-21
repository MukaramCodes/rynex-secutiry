"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SiteLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Hide the public header/footer if the current route is within the portal
  const isPortal = pathname?.startsWith("/portal");

  return (
    <>
      {!isPortal && <Header />}
      {children}
      {!isPortal && <Footer />}
    </>
  );
}
