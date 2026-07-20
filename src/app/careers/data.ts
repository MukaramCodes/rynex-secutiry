export type Job = {
  id: string;
  title: string;
  department: "Red Team" | "Blue Team" | "GRC" | "Engineering" | "Operations";
  type: "Remote" | "Onsite" | "Hybrid";
  experience: "Junior" | "Mid-Level" | "Senior";
  location: string;
  description: string;
  tags: string[];
  isOpen: boolean;
};

export type HiringStep = {
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  detail: string;
  icon: string;
};

export type Story = {
  name: string;
  role: string;
  quote: string;
  initial: string;
};

export const hiringSteps: HiringStep[] = [
  {
    number: "01",
    shortTitle: "Search & Apply",
    title: "Search & Apply",
    description: "Browse our open positions and submit your application online.",
    detail:
      "Start by exploring our open positions to find the role that best matches your skills and aspirations. Submit your application with your CV and a brief note about why you want to join Rynex Security. We review every application personally — no automated rejections.",
    icon: "fa-search",
  },
  {
    number: "02",
    shortTitle: "Application Review",
    title: "Application Review",
    description: "Our team carefully evaluates your background and experience.",
    detail:
      "Our hiring team reviews every application with a human eye. We evaluate your technical background, relevant experience, and alignment with our mission. You will hear back from us within 5–7 business days. Shortlisted candidates are invited for a technical screening.",
    icon: "fa-file-lines",
  },
  {
    number: "03",
    shortTitle: "Technical Interview",
    title: "Technical Interview",
    description: "Demonstrate your hands-on cybersecurity knowledge and skills.",
    detail:
      "The technical interview is a structured conversation paired with a practical challenge. We assess your real-world skills, not just theoretical knowledge. Expect scenario-based questions aligned with the role — VAPT, SOC, GRC, or engineering. We want to see how you think under realistic conditions.",
    icon: "fa-terminal",
  },
  {
    number: "04",
    shortTitle: "Final Interview",
    title: "Final Interview",
    description: "Meet the Rynex leadership team and discuss cultural fit.",
    detail:
      "The final round is a conversation with Rynex leadership. We discuss your career goals, how you collaborate with teams, and how your values align with ours. This is also your opportunity to ask us anything — about our roadmap, team culture, or day-to-day operations.",
    icon: "fa-handshake",
  },
  {
    number: "05",
    shortTitle: "Offer & Onboard",
    title: "Offer & Onboarding",
    description: "Receive your offer and step into the Rynex Security team.",
    detail:
      "Successful candidates receive a competitive offer outlining compensation, role expectations, and benefits. Once accepted, our onboarding program ensures you hit the ground running — with access to tooling, documentation, team introductions, and a structured 30-day ramp plan.",
    icon: "fa-rocket",
  },
];

export const stories: Story[] = [
  {
    name: "Agha Asfand Yar khan ",
    role: "Director — Offensive Security",
    initial: "A",
    quote:
      "Joining Rynex was the best move I made. I went from textbook theory to running live engagements within my first month. The team trusts you to deliver, which pushes you to grow fast.",
  },
  {
    name: "Muhammad Talha",
    role: "Director — Defensive Security",
    initial: "O",
    quote:
      "What sets Rynex apart is the pace. Every week brings a new incident, a new tool, a new challenge. I have learned more here in six months than in two years elsewhere.",
  },
  {
    name: "Mukaram Moavia ",
    role: "Director — Technical Department",
    initial: "M",
    quote:
      "At Rynex, we are not just offering jobs; we are offering careers that matter. Every day, our team works on the front lines of cybersecurity, protecting critical infrastructure and sensitive data across the globe. If you are passionate about making a real impact and want to grow with a team that values innovation, collaboration, and excellence, Rynex is the place for you.",
  },
];

export const jobs: Job[] = [
  {
    id: "vapt-senior",
    title: "Senior Penetration Tester",
    department: "Red Team",
    type: "Remote",
    experience: "Senior",
    location: "Remote — Worldwide",
    description:
      "Lead end-to-end penetration testing engagements across web applications, internal networks, and cloud environments. Produce detailed reports and mentor junior analysts.",
    tags: ["VAPT", "Burp Suite", "Metasploit", "Python"],
    isOpen: false,
  },
  {
    id: "vapt-junior",
    title: "Junior Penetration Tester",
    department: "Red Team",
    type: "Remote",
    experience: "Junior",
    location: "Remote — Worldwide",
    description:
      "Support senior penetration testers across web, network, and API engagements. Contribute to vulnerability discovery, exploitation, and technical report writing.",
    tags: ["VAPT", "OWASP", "Linux", "Networking"],
    isOpen: false,
  },
  {
    id: "soc-analyst-mid",
    title: "SOC Analyst (Tier II)",
    department: "Blue Team",
    type: "Remote",
    experience: "Mid-Level",
    location: "Remote — APAC / EMEA",
    description:
      "Investigate escalated security alerts, correlate threat intelligence, and coordinate incident response activities. Work closely with clients to reduce dwell time.",
    tags: ["SIEM", "Splunk", "Threat Intelligence", "IR"],
    isOpen: false,
  },
  {
    id: "soc-analyst-junior",
    title: "SOC Analyst (Tier I)",
    department: "Blue Team",
    type: "Remote",
    experience: "Junior",
    location: "Remote — Worldwide",
    description:
      "Monitor security dashboards, triage incoming alerts, and escalate confirmed incidents to Tier II analysts. Maintain shift logs and document findings accurately.",
    tags: ["SIEM", "Log Analysis", "Endpoint Security"],
    isOpen: false,
  },
  {
    id: "grc-consultant",
    title: "GRC Consultant",
    department: "GRC",
    type: "Hybrid",
    experience: "Mid-Level",
    location: "Hybrid — Pakistan / Remote",
    description:
      "Assist clients with compliance gap assessments, risk registers, and policy development aligned to ISO 27001, NIST CSF, and regional regulatory requirements.",
    tags: ["ISO 27001", "NIST", "Risk Management", "Policy"],
    isOpen: false,
  },
  {
    id: "cloud-security-eng",
    title: "Cloud Security Engineer",
    department: "Engineering",
    type: "Remote",
    experience: "Senior",
    location: "Remote — Worldwide",
    description:
      "Design and implement security controls across AWS, Azure, and GCP environments. Conduct cloud configuration reviews and drive cloud hardening initiatives for clients.",
    tags: ["AWS", "Azure", "GCP", "Terraform", "IAM"],
    isOpen: false,
  },
  {
    id: "threat-hunter",
    title: "Threat Hunter",
    department: "Blue Team",
    type: "Remote",
    experience: "Senior",
    location: "Remote — Worldwide",
    description:
      "Proactively hunt for advanced persistent threats across client environments using behavioral analysis, custom detection rules, and threat-intelligence feeds.",
    tags: ["Threat Hunting", "KQL", "YARA", "EDR"],
    isOpen: false,
  },
  {
    id: "malware-analyst",
    title: "Malware Analyst",
    department: "Red Team",
    type: "Remote",
    experience: "Mid-Level",
    location: "Remote — Worldwide",
    description:
      "Perform static and dynamic analysis of malware samples submitted by clients. Produce actionable indicators of compromise and technical analysis reports.",
    tags: ["Malware Analysis", "Ghidra", "IDA Pro", "Sandbox"],
    isOpen: false,
  },
  {
    id: "ops-coordinator",
    title: "Operations Coordinator",
    department: "Operations",
    type: "Onsite",
    experience: "Junior",
    location: "Onsite — Karachi, Pakistan",
    description:
      "Support day-to-day operational activities including client onboarding, project scheduling, and internal communications. Coordinate across technical and non-technical teams.",
    tags: ["Project Management", "Communication", "Admin"],
    isOpen: false,
  },
];
export const featuredJobs = jobs.filter((job) => job.isOpen).slice(0, 3);
