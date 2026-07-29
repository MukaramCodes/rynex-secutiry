import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import SiteLayoutWrapper from "@/components/SiteLayoutWrapper";
import { headers } from "next/headers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "Rynex Security | Detect . Exploit . Secure",
  description:
    "Rynex Security offers VAPT, SOC, GRC, threat hunting, and malware analysis services. Practical cybersecurity expertise protecting businesses from real-world cyber threats.",
  icons: {
    icon: [
      { url: "/images/logo-transparent.png", type: "image/png" },
    ],
    shortcut: "/images/logo-transparent.png",
    apple: "/images/logo-transparent.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const isPortalHost = host.includes("portal");
  return (
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body suppressHydrationWarning>
        <SiteLayoutWrapper isPortalHost={isPortalHost}>
          {children}
        </SiteLayoutWrapper>
        <SpeedInsights />
      </body>
    </html>
  );
}
