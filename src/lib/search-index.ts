import { getAllPosts } from "./posts";
import { services } from "./site-data";

export type SearchResult = {
  type: "page" | "service" | "blog";
  title: string;
  description: string;
  href: string;
};

const staticPages: SearchResult[] = [
  { type: "page", title: "Home", description: "Rynex Security — Detect. Exploit. Secure.", href: "/" },
  { type: "page", title: "About Us", description: "Our legacy, mission, vision, and founder's message.", href: "/about" },
  { type: "page", title: "Our Services", description: "VAPT, SOC, GRC, Threat Hunting, Malware Analysis, Security Audits.", href: "/services" },
  { type: "page", title: "Blog", description: "Cybersecurity insights, threat trends, and analysis.", href: "/blog" },
  { type: "page", title: "Contact Us", description: "Get in touch for a consultation.", href: "/contact" },
  { type: "page", title: "Internship Program 2026", description: "Six-week remote cybersecurity internship — Red Team (VAPT) and Blue Team (SOC) tracks.", href: "/internship" },
];

export function searchSite(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const serviceResults: SearchResult[] = services.map((s) => ({
    type: "service",
    title: s.title,
    description: s.description,
    href: "/services",
  }));

  const blogResults: SearchResult[] = getAllPosts().map((p) => ({
    type: "blog",
    title: p.title,
    description: p.excerpt,
    href: `/blog/${p.slug}`,
  }));

  const all = [...staticPages, ...serviceResults, ...blogResults];

  return all.filter(
    (item) =>
      item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
  );
}
