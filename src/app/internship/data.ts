export const detailCards = [
  { title: "Program Length", text: "Six weeks of practical cybersecurity training delivered through focused weekend sessions and real-world challenges." },
  { title: "Delivery", text: "100% remote with Discord-based workshops, mentorship, and a collaborative learning environment." },
  { title: "Tracks", text: "Choose your path: Red Team (VAPT) or Blue Team (SOC) for focused skill development." },
  { title: "Start Date", text: "The cohort begins 11 July 2026, with applications reviewed immediately after submission." },
  { title: "Commitment", text: "Expect 8–12 hours per week including weekend lessons, labs, and report work." },
  { title: "Outcomes", text: "Receive a completion certificate, portfolio-ready deliverables, and real internship experience." },
];

export type Week = {
  when: string;
  label: string;
  title: string;
  topics: string[];
  engagement: string;
};

export const vaptWeeks: Week[] = [
  {
    when: "Week 01 · 11–12 July 2026",
    label: "Field Exercise",
    title: "Foundations of Offensive Security",
    topics: ["Attacker Mindset & Ethics", "The Cyber Kill Chain", "Linux CLI Basics for Security", "Lab Environment Setup (Kali Linux + VirtualBox)"],
    engagement: "Engagement: set up Kali Linux, document the lab, execute reconnaissance commands, and submit an environment report.",
  },
  {
    when: "Week 02 · 18–19 July 2026",
    label: "Field Exercise",
    title: "Reconnaissance & OSINT",
    topics: ["Passive Reconnaissance Techniques", "Active Reconnaissance with Nmap", "OSINT Methodology & Tools", "DNS Enumeration & Subdomain Discovery"],
    engagement: "Engagement: deliver a structured reconnaissance report with discovered ports, services, versions, and OSINT findings.",
  },
  {
    when: "Week 03 · 25–26 July 2026",
    label: "Field Exercise",
    title: "Web Application Attacks",
    topics: ["OWASP Top 10 Vulnerabilities", "SQL Injection (manual & automated)", "Cross-Site Scripting (XSS)", "Burp Suite — Intercept, Repeater, Scanner"],
    engagement: "Engagement: exploit two vulnerabilities on the lab instance and submit a findings report with payloads and impact analysis.",
  },
  {
    when: "Week 04 · 01–02 August 2026",
    label: "Field Exercise",
    title: "Exploitation & Post-Exploitation",
    topics: ["Metasploit Framework — Modules, Payloads, Sessions", "Privilege Escalation Techniques", "Establishing Persistence", "Lateral Movement Fundamentals"],
    engagement: "Engagement: exploit a lab target, escalate privileges, and demonstrate post-exploitation evidence.",
  },
  {
    when: "Week 05 · 08–09 August 2026",
    label: "Field Exercise",
    title: "Pentest Reporting & Professional Methodology",
    topics: ["Professional Pentest Report Structure", "CVSS Scoring & Risk Rating", "Actionable Remediation Advice", "Client Communication & Executive Summaries"],
    engagement: "Engagement: deliver a professional pentest report with executive summary, evidence, and remediation advice.",
  },
  {
    when: "Week 06 · 15–16 August 2026",
    label: "🎯 Final Operation",
    title: "Full Simulated Penetration Test Engagement",
    topics: ["End-to-End Black-Box VAPT", "Multi-Vector Attack Chains", "Full Professional Report Delivery", "Team Debrief & Evaluation"],
    engagement: "Final Operation: submit a complete VAPT report for review and scoring by the Rynex Security team.",
  },
];

export const socWeeks: Week[] = [
  {
    when: "Week 01 · 11–12 July 2026",
    label: "Field Exercise",
    title: "SOC Fundamentals & Analyst Workflow",
    topics: ["SOC Tiers, Roles & Responsibilities", "The Defender Mindset", "Core Security Concepts", "Tool Landscape Overview"],
    engagement: "Engagement: create a SOC blueprint mapping tier structure, tool roles, and the Tier-1 alert lifecycle.",
  },
  {
    when: "Week 02 · 18–19 July 2026",
    label: "Field Exercise",
    title: "Log Analysis & SIEM Operations",
    topics: ["Log Types & Sources", "How SIEMs Work", "Writing Correlation Rules", "Alert Triage & Classification"],
    engagement: "Engagement: analyze log datasets, correlate suspicious events, and submit an alert triage report.",
  },
  {
    when: "Week 03 · 25–26 July 2026",
    label: "Field Exercise",
    title: "Network Traffic Analysis",
    topics: ["Wireshark Capture, Filters & Protocol Dissection", "Packet-Level Analysis", "Detecting C2 Beaconing & Exfiltration", "Network IOCs"],
    engagement: "Engagement: inspect a PCAP capture, extract IOCs, and explain the suspected attack pattern.",
  },
  {
    when: "Week 04 · 01–02 August 2026",
    label: "Field Exercise",
    title: "Threat Intelligence & Malware Analysis",
    topics: ["CTI Frameworks & MITRE ATT&CK", "IOC Collection & Enrichment", "VirusTotal, AbuseIPDB, OTX", "Static Malware Analysis Basics"],
    engagement: "Engagement: research a sample hash, map behaviors to MITRE ATT&CK, and build an enriched threat profile.",
  },
  {
    when: "Week 05 · 08–09 August 2026",
    label: "Field Exercise",
    title: "Incident Response & Playbooks",
    topics: ["NIST Incident Response Lifecycle", "Detection, Containment, Eradication & Recovery", "Building IR Playbooks", "Post-Incident Reporting"],
    engagement: "Engagement: document a phishing-to-ransomware scenario through each IR phase and recommend recovery steps.",
  },
  {
    when: "Week 06 · 15–16 August 2026",
    label: "🎯 Final Operation",
    title: "Full SOC Simulation — Live Incident Response",
    topics: ["Multi-Stage Live Incident Scenario", "End-to-End Incident Response Execution", "Comprehensive Final Report", "Team Debrief & Evaluation"],
    engagement: "Final Operation: submit a complete incident report with timeline, MITRE mapping, and remediation recommendations.",
  },
];

export const selectionSteps = [
  { step: "01 · Now Open", title: "Submit Your Application", text: "Application details will be shared soon. We will announce the next intake and submission steps once the portal opens." },
  { step: "02 · After Deadline", title: "CV Review & Shortlisting", text: "Every application is reviewed and filtered only if there is no technology or cybersecurity relevance." },
  { step: "03 · Shortlisted Candidates", title: "Interview Round", text: "A short, informal interview via Discord or Google Meet to confirm availability and track preference." },
  { step: "04 · Selected", title: "Offer & Discord Onboarding", text: "Accepted candidates receive a confirmation and exclusive invite to the Rynex Security Discord server." },
];

export const criteria = [
  "Students or fresh graduates in CS, IT, Cybersecurity, or related fields.",
  "Basic networking awareness and general OS familiarity.",
  "Genuine interest in cybersecurity over certifications.",
  "Commitment to weekend availability and engagement completion.",
  "Active Discord participation and responsiveness.",
  "Stable computer and internet setup using free and open-source tools.",
];

export const timelineItems = [
  { step: "1", when: "April 2026", title: "Application Opens", text: "The application portal opens and cohort details are shared across LinkedIn and Discord." },
  { step: "2", when: "04 July 2026", title: "Application Deadline", text: "Submit your application by this date to be considered for the 2026 cohort." },
  { step: "3", when: "05–10 July 2026", title: "Review & Shortlisting", text: "Applications are reviewed, candidates are shortlisted, and interview invitations are sent." },
  { step: "4", when: "10 July 2026", title: "Interview Round", text: "Shortlisted candidates participate in a brief, informal interview to confirm fit and availability." },
  { step: "5", when: "11 July 2026", title: "Orientation & Kick-Off", text: "Accepted interns join orientation, receive program resources, and start Week 1 of the internship." },
  { step: "6", when: "15–16 August 2026", title: "Program Completion", text: "Final capstone submissions are reviewed and certificates are awarded to successful participants." },
];

export const benefits = [
  { icon: "fa-certificate", title: "Certificate of Completion", text: "Official digital certificate issued upon successful completion, ready to share on LinkedIn." },
  { icon: "fa-shield-alt", title: "Real Operations Experience", text: "Tasks reflect real-world cybersecurity work and produce professional-grade deliverables." },
  { icon: "fa-users", title: "Professional Mentorship", text: "Mentors provide guidance, feedback, and support throughout the six-week program." },
  { icon: "fa-network-wired", title: "Professional Network", text: "Join a growing community of cybersecurity students, graduates, and professionals." },
  { icon: "fa-file-alt", title: "Portfolio-Grade Deliverables", text: "Produce reports and analyses that can be shown to recruiters and hiring managers." },
  { icon: "fa-rocket", title: "Career Head Start", text: "Internship experience at a growing cybersecurity startup adds value to entry-level applications." },
];

export const faqs = [
  { q: "What are the exact program dates?", a: "Applications close on 04 July 2026. Shortlisting and interviews run from 05–10 July. Orientation is on 11 July 2026. The program then runs through 15–16 August 2026." },
  { q: "Is this internship paid?", a: "This is an unpaid skill-building internship. Participants earn a Certificate of Completion and develop a portfolio of real cybersecurity deliverables." },
  { q: "Can I apply as a complete beginner?", a: "Yes. Beginners with genuine interest are welcome. Basic networking and operating system awareness helps, but advanced skills are not required." },
  { q: "How much time do I need to commit each week?", a: "Expect approximately 8–12 hours per week, including weekend sessions and engagement brief completion." },
  { q: "Do I need a specific computer or setup?", a: "Any modern computer with stable internet is sufficient. Tools are free and open-source; setup guidance is provided during orientation." },
  { q: "Can I apply for both the Red Team and Blue Team tracks?", a: "Each intern is assigned one track for deeper skill development. You may indicate first and second preferences on the application form." },
];
