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


export type ServiceHighlight = {
  icon: string;
  title: string;
  description: string;
};

export type Service = {
  slug: string;
  icon: string;
  title: string;
  shortDescription: string;
  description: string;
  overview: string;
  highlights: ServiceHighlight[];
};

export const services: Service[] = [
  {
    slug: "vapt",
    icon: "fa-shield-virus",
    title: "VAPT",
    shortDescription:
      "Vulnerability Assessment & Penetration Testing",
    description:
      "Vulnerability Assessment & Penetration Testing. We simulate sophisticated real-world attacks to identify and remediate vulnerabilities across your entire digital ecosystem.",

    overview:
      "Our VAPT service combines automated vulnerability discovery with manual penetration testing to identify exploitable weaknesses across web applications, networks, APIs, cloud environments, and internal infrastructure.",

    highlights: [
      {
        icon: "fa-magnifying-glass",
        title: "Vulnerability Discovery",
        description:
          "Identify security weaknesses, exposed services, insecure configurations, and vulnerable components across your digital environment.",
      },
      {
        icon: "fa-user-secret",
        title: "Manual Exploitation",
        description:
          "Validate discovered vulnerabilities through controlled exploitation and determine their real-world technical and business impact.",
      },
      {
        icon: "fa-file-shield",
        title: "Remediation Report",
        description:
          "Receive prioritized findings, proof-of-concept evidence, severity ratings, and practical remediation recommendations.",
      },
    ],
  },

  {
    slug: "soc",
    title: "SOC Monitoring",
    icon: "fa-user-secret",
    shortDescription:
      "Continuous monitoring and rapid security incident response.",
    description:
      "Continuous monitoring and rapid response to detect and mitigate security incidents in real time.",

    overview:
      "Our SOC service provides continuous visibility into security events, suspicious activity, and potential incidents across your technology environment.",

    highlights: [
      {
        icon: "fa-desktop",
        title: "Continuous Monitoring",
        description:
          "Monitor systems, endpoints, cloud environments, and security logs for suspicious activity and emerging threats.",
      },
      {
        icon: "fa-bell",
        title: "Threat Detection",
        description:
          "Detect abnormal behavior, malicious indicators, policy violations, and high-risk security events.",
      },
      {
        icon: "fa-bolt",
        title: "Incident Response",
        description:
          "Investigate alerts, contain threats, coordinate response actions, and reduce the impact of security incidents.",
      },
    ],
  },

  {
    slug: "grc-security",
    icon: "fa-file-contract",
    title: "GRC & Security",
    shortDescription:
      "Governance, Risk, Compliance & Security Audits",
    description:
      "Governance, Risk & Compliance combined with comprehensive Security Audits. We align your organization with global standards, manage security risks, and evaluate technical controls to build robust security maturity.",

    overview:
      "Our GRC & Security service provides an end-to-end approach to cybersecurity governance, risk management, regulatory compliance, and comprehensive technical security audits across your organization.",

    highlights: [
      {
        icon: "fa-scale-balanced",
        title: "Compliance & Control Assessment",
        description:
          "Evaluate your technical and administrative controls against global regulations, contractual obligations, and security frameworks.",
      },
      {
        icon: "fa-chart-line",
        title: "Risk & Gap Management",
        description:
          "Identify, assess, prioritize, and remediate security risks, missing controls, and implementation gaps across your infrastructure.",
      },
      {
        icon: "fa-clipboard-check",
        title: "Policy Development & Roadmap",
        description:
          "Develop robust security policies, control matrices, risk registers, and actionable roadmaps for continuous security improvement.",
      },
    ],
  },

  {
    slug: "threat-hunting",
    icon: "fa-search",
    title: "Threat Hunting",
    shortDescription:
      "Proactive threat detection",
    description:
      "Proactive search for advanced persistent threats (APTs) lurking in your network. We find and neutralize attackers before they can execute their mission.",

    overview:
      "Our threat-hunting service proactively searches for hidden attackers, compromised accounts, malicious activity, and advanced threats that may have bypassed traditional security controls.",

    highlights: [
      {
        icon: "fa-binoculars",
        title: "Proactive Investigation",
        description:
          "Search for suspicious behavior and attacker activity before automated security tools generate an alert.",
      },
      {
        icon: "fa-network-wired",
        title: "Behavioral Analysis",
        description:
          "Analyze endpoint, network, identity, and cloud activity to identify anomalies and attacker techniques.",
      },
      {
        icon: "fa-crosshairs",
        title: "Threat Containment",
        description:
          "Validate discovered threats, determine their scope, and provide practical containment and remediation guidance.",
      },
    ],
  },

  {
    slug: "malware-analysis",
    icon: "fa-bug",
    title: "Malware Analysis",
    shortDescription:
      "Deep technical malware research",
    description:
      "Deep technical analysis of suspicious files and payloads to understand their behavior, origin, and impact, providing you with definitive defense strategies.",

    overview:
      "Our malware-analysis service examines suspicious files, scripts, documents, executables, and payloads to determine their capabilities, behavior, persistence methods, and potential impact.",

    highlights: [
      {
        icon: "fa-microscope",
        title: "Static Analysis",
        description:
          "Inspect file structure, strings, metadata, embedded resources, and code characteristics without executing the sample.",
      },
      {
        icon: "fa-code",
        title: "Behavioral Analysis",
        description:
          "Observe process activity, network communication, persistence mechanisms, and system modifications in a controlled environment.",
      },
      {
        icon: "fa-file-shield",
        title: "Indicators and Defenses",
        description:
          "Receive indicators of compromise, technical findings, detection recommendations, and containment guidance.",
      },
    ],
  },

  {
    slug: "cloud-security",
    icon: "fa-cloud",
    title: "Cloud Security",
    shortDescription:
      "Protecting your data in the cloud",
    description:
      "Protecting your data in the cloud. We ensure your cloud infrastructure is secure and compliant with industry standards, providing you with peace of mind.",

    overview:
      "Our cloud-security service assesses cloud infrastructure, identities, permissions, configurations, workloads, storage, networking, and monitoring controls across modern cloud environments.",

    highlights: [
      {
        icon: "fa-cloud",
        title: "Cloud Configuration Review",
        description:
          "Identify insecure storage, public exposure, weak network controls, logging gaps, and dangerous configuration settings.",
      },
      {
        icon: "fa-user-lock",
        title: "Identity and Access Review",
        description:
          "Assess users, roles, service accounts, permissions, privileged access, and identity-management controls.",
      },
      {
        icon: "fa-shield-halved",
        title: "Cloud Hardening",
        description:
          "Receive prioritized recommendations to improve cloud security, compliance, monitoring, and operational resilience.",
      },
    ],
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
