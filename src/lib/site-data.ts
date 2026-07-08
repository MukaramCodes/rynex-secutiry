export type NavLink = {
  label: string;
  href: string;
};

export const primaryNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "Internship", href: "/internship" },
  { label: "Contact", href: "/contact" },
];

export type Service = {
  slug: string;
  icon: string;
  title: string;
  shortDescription: string;
  description: string;
};

export const services: Service[] = [
  {
    slug: "vapt",
    icon: "fa-shield-virus",
    title: "VAPT",
    shortDescription: "Vulnerability Assessment & Penetration Testing",
    description:
      "Vulnerability Assessment & Penetration Testing. We simulate sophisticated real-world attacks to identify and remediate vulnerabilities across your entire digital ecosystem.",
  },
  {
    slug: "soc",
    icon: "fa-user-secret",
    title: "SOC",
    shortDescription: "Security Operations Center",
    description:
      "Security Operations Center. Our elite team provides 24/7 monitoring, threat detection, and rapid incident response to ensure your business remains resilient.",
  },
  {
    slug: "grc",
    icon: "fa-file-contract",
    title: "GRC",
    shortDescription: "Governance, Risk & Compliance",
    description:
      "Governance, Risk & Compliance. We align your security posture with global standards and regulatory requirements, ensuring robust risk management and compliance.",
  },
  {
    slug: "threat-hunting",
    icon: "fa-search",
    title: "Threat Hunting",
    shortDescription: "Proactive threat detection",
    description:
      "Proactive search for advanced persistent threats (APTs) lurking in your network. We find and neutralize attackers before they can execute their mission.",
  },
  {
    slug: "malware-analysis",
    icon: "fa-bug",
    title: "Malware Analysis",
    shortDescription: "Deep technical malware research",
    description:
      "Deep technical analysis of suspicious files and payloads to understand their behavior, origin, and impact, providing you with definitive defense strategies.",
  },
  {
    slug: "security-audits",
    icon: "fa-clipboard-check",
    title: "Security Audits",
    shortDescription: "Comprehensive security maturity review",
    description:
      "Comprehensive technical and policy audits to evaluate your organization's security maturity and provide a roadmap for continuous improvement.",
  },
];

export const contactInfo = {
  email: "info@rynexsecurity.com",
  phone: "03272873812",
  phoneDisplay: "+92 327 287 3812",
  discord: "https://discord.gg/6xJdYsJ6uF",
  discordFooter: "https://discord.gg/V8CYUKCSKJ",
  linkedin: "https://www.linkedin.com/company/rynex-security",
  instagram: "https://www.instagram.com/rynex.security",
};
