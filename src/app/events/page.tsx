"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import NetworkBackground from "@/components/NetworkBackground";
import styles from "./events.module.css";

// Target Audience Categories
const targetAudience = [
  {
    id: "students",
    title: "University Students",
    icon: "fa-user-gradient",
    role: "CS & InfoSec Undergrads/Grads",
    description:
      "Undergraduate and postgraduate students eager to apply classroom knowledge to real-world security challenges, test their hacking capabilities, and build competitive resume-worthy experience.",
    benefits: [
      "Bridge academic theory with hands-on CTF challenges",
      "Network directly with leading cybersecurity recruiters",
      "Win cash prizes and physical certificates of distinction",
      "Gain pre-vetted exposure for internship placements",
    ],
  },
  {
    id: "pros",
    title: "Cyber Security Professionals",
    icon: "fa-shield-halved",
    role: "SOC, GRC & Pen Testers",
    description:
      "Working practitioners across SOC, GRC, penetration testing, and incident response looking to benchmark their skills, tackle complex exploitation vectors, and stay ahead of modern threat actors.",
    benefits: [
      "Benchmark technical capabilities against nationwide peers",
      "Test offensive & defensive tactics on enterprise scenarios",
      "Explore high-level industry networking & leadership roles",
      "Engage with top security vendors and sponsors",
    ],
  },
  {
    id: "hackers",
    title: "Ethical Hackers & Researchers",
    icon: "fa-user-secret",
    role: "Bug Bounty Hunters & CTF Veterans",
    description:
      "Independent researchers and bug bounty hunters drawn to the gamified, challenge-based format of Jeopardy CTF play, motivated by recognition in Pakistan's ethical hacking community.",
    benefits: [
      "Solve advanced reverse engineering & web security challenges",
      "Climb the nationwide live Jeopardy scoreboard",
      "Earn exclusive cash rewards & bounty honors",
      "Showcase zero-day analysis & exploit techniques",
    ],
  },
  {
    id: "devs",
    title: "Software & IT Engineers",
    icon: "fa-code-branch",
    role: "Developers & SysAdmins",
    description:
      "Developers and IT professionals looking to deepen their understanding of secure coding practices, application vulnerabilities, and network security defenses.",
    benefits: [
      "Understand attacker methodologies to write resilient code",
      "Analyze network packet captures & server logs",
      "Strengthen enterprise day-to-day defense practices",
      "Expand skill sets into full-stack cybersecurity",
    ],
  },
];

// CTF Challenge Categories
const ctfTracks = [
  {
    icon: "fa-globe",
    title: "Web Exploitation",
    desc: "Uncover logic bugs, SQL injections, XSS, JWT flaws, and SSRF in real-world web targets.",
    tags: ["OWASP Top 10", "API Hacking", "XSS", "SQLi"],
  },
  {
    icon: "fa-magnifying-glass",
    title: "Digital Forensics",
    desc: "Analyze PCAP network captures, inspect memory dumps, and extract hidden metadata.",
    tags: ["Network PCAP", "RAM Analysis", "Steganography"],
  },
  {
    icon: "fa-gears",
    title: "Reverse Engineering",
    desc: "Decompile obfuscated binaries, disassemble ELF/PE executables, and bypass anti-debugging.",
    tags: ["Assembly", "GDB/Ghidra", "Decompilation"],
  },
  {
    icon: "fa-network-wired",
    title: "Network Security",
    desc: "Inspect protocol anomalies, decrypt encrypted channels, and pivot across compromised networks.",
    tags: ["Wireshark", "Packet Analysis", "Firewalls"],
  },
];

// Sponsorship Tiers Data
const sponsorTiers = [
  {
    name: "Title Sponsor",
    price: "PKR 200,000",
    tier: "Flagship Partner",
    featured: true,
    badge: "Most Exclusive",
    features: [
      "Exclusive Headline Branding across event & stage",
      "Keynote Opening Ceremony Speaking Rights",
      "Entrance + Main Stage Banner Placement",
      "Primary Position on Official Certificates",
      "Dedicated Social Media Posts + Stories",
      "Dedicated Recruitment Booth & Talent Access",
      "Exclusive VIP Dinner Access with Founders",
      "All Marketing Materials & Dedicated Promo Video",
    ],
  },
  {
    name: "Platinum Sponsor",
    price: "PKR 100,000",
    tier: "Premium Partner",
    featured: false,
    badge: "",
    features: [
      "Large Logo Placement on Website & Stage",
      "Panel Discussion Speaking Opportunity",
      "Standard Exhibition Booth Space",
      "Dedicated Social Media Feature Posts",
      "Logo on Certificates & Participant Swag",
      "Direct Recruitment Booth & Candidate Access",
      "VIP Dinner Access",
    ],
  },
  {
    name: "Gold Sponsor",
    price: "PKR 50,000",
    tier: "Balanced Mid-Tier",
    featured: false,
    badge: "",
    features: [
      "Medium Logo Placement on Main Hall Banners",
      "Shared Exhibition Booth Space",
      "Group Social Media Mentions & Email Campaigns",
      "Logo Placement on Website & Select Materials",
      "Recruitment Booth Access & Swag Distribution",
    ],
  },
  {
    name: "Silver Sponsor",
    price: "PKR 25,000",
    tier: "Core Visibility",
    featured: false,
    badge: "",
    features: [
      "Small Logo on Official Website & Certificates",
      "Banner Placement in Registration Area",
      "Group Social Media Recognition",
      "Logo on Select Marketing Materials",
    ],
  },
  {
    name: "Community Partner",
    price: "In-Kind",
    tier: "Non-Cash Track",
    featured: false,
    badge: "",
    features: [
      "Logo Placement on Website Community Wall",
      "Single Social Media Sponsor Announcement",
      "In-Kind Support (Prizes, Venue, Tech, Mentorship)",
      "Official Recognition during Ceremonies",
    ],
  },
];

// Sponsorship Matrix Features Table
const benefitsMatrix = [
  { feature: "Investment (PKR)", title: "200,000", platinum: "100,000", gold: "50,000", silver: "25,000", community: "In-Kind" },
  { feature: "Logo Placement", title: "Premium Largest", platinum: "Large", gold: "Medium", silver: "Small", community: "Community Wall" },
  { feature: "Website Homepage Logo", title: "Yes", platinum: "Yes", gold: "Yes", silver: "Yes", community: "Yes" },
  { feature: "Social Media Promotion", title: "Dedicated Posts + Stories", platinum: "Dedicated Posts", gold: "Group Mention", silver: "Group Mention", community: "Single Mention" },
  { feature: "Opening Ceremony", title: "Yes — Featured", platinum: "Yes", gold: "Yes", silver: "Yes", community: "No" },
  { feature: "Speaking Opportunity", title: "Keynote Slot", platinum: "Panel Slot", gold: "No", silver: "No", community: "No" },
  { feature: "Exhibition Booth", title: "Premium Booth", platinum: "Standard Booth", gold: "Shared Booth", silver: "No", community: "No" },
  { feature: "Recruitment Booth", title: "Yes", platinum: "Yes", gold: "Yes", silver: "No", community: "No" },
  { feature: "Certificate Logo", title: "Primary Position", platinum: "Yes", gold: "Yes", silver: "Yes", community: "No" },
  { feature: "VIP Networking / Dinner", title: "VIP Dinner Access", platinum: "Yes", gold: "No", silver: "No", community: "No" },
];

export default function EventsPage() {
  const [activeAudience, setActiveAudience] = useState("students");
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [sponsorModalOpen, setSponsorModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState("Title Sponsor");
  const [carouselOffset, setCarouselOffset] = useState(0);
  const [carouselAnimate, setCarouselAnimate] = useState(true);
  const [slideWidth, setSlideWidth] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Registration Form State
  const [regForm, setRegForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "University Student",
    organization: "",
    experience: "Beginner",
  });
  const [regSuccess, setRegSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sponsor Form State
  const [sponsorForm, setSponsorForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    tier: "Title Sponsor",
    message: "",
  });
  const [sponsorSuccess, setSponsorSuccess] = useState(false);

  // CTF Terminal Simulator State
  const [terminalHistory, setTerminalHistory] = useState<Array<{ cmd: string; output: string }>>([
    { cmd: "init_ctf --target rynex_eclipse_2026", output: "SYSTEM INITIALIZED: Welcome to Rynex Eclipse 2026 CTF Gateway." },
    { cmd: "cat challenge_preview.txt", output: "[+] CTF Flag format: RYNEX{...}\n[+] Available tracks: Web, Forensics, Reverse Eng, Network.\n[+] Type 'help' or click quick command buttons below." },
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdHistoryIdx, setCmdHistoryIdx] = useState<number>(-1);
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalHistory]);

  // ── Carousel: compute slide width on mount + resize
  useEffect(() => {
    const computeSlide = () => {
      if (stageRef.current) {
        const gap = 24;
        setSlideWidth((stageRef.current.offsetWidth - gap) / 2 + gap);
      }
    };
    computeSlide();
    window.addEventListener("resize", computeSlide);
    return () => window.removeEventListener("resize", computeSlide);
  }, []);

  // ── Carousel: auto-scroll helper
  const startAutoScroll = () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    autoScrollRef.current = setInterval(() => {
      setCarouselOffset((prev) => prev + 1);
    }, 3200);
  };

  useEffect(() => {
    startAutoScroll();
    return () => { if (autoScrollRef.current) clearInterval(autoScrollRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Carousel: snap back to 0 when cloned section reached
  useEffect(() => {
    if (carouselOffset >= sponsorTiers.length) {
      const t = setTimeout(() => {
        setCarouselAnimate(false);
        setCarouselOffset(0);
        setTimeout(() => setCarouselAnimate(true), 30);
      }, 460);
      return () => clearTimeout(t);
    }
  }, [carouselOffset]);

  const goCarouselNext = () => {
    startAutoScroll();
    setCarouselOffset((prev) => prev + 1);
  };

  const goCarouselPrev = () => {
    startAutoScroll();
    if (carouselOffset === 0) {
      setCarouselAnimate(false);
      setCarouselOffset(sponsorTiers.length);
      setTimeout(() => {
        setCarouselAnimate(true);
        setCarouselOffset(sponsorTiers.length - 1);
      }, 30);
    } else {
      setCarouselOffset((prev) => prev - 1);
    }
  };

  const carouselItems = [...sponsorTiers, ...sponsorTiers];
  const activeDotIdx = carouselOffset % sponsorTiers.length;

  const runTerminalCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    let output = "";
    const lowerCmd = cmd.toLowerCase();

    if (lowerCmd === "help") {
      output = `[*] Available Rynex CTF Terminal Commands:\n - help         : Show available terminal commands\n - status       : View event date, venue, fee & registration status\n - tracks       : List CTF challenge categories (Web, Forensics, Reversing, Network)\n - rules        : CTF competition guidelines & flag submission format\n - prizes       : View prize pool, cash awards & trophy details\n - register     : Open competitor pre-registration form directly\n - sponsor      : Open sponsorship inquiry modal directly\n - submit <flag>: Submit CTF flag (Try flag: RYNEX{3cl1ps3_2026_c4ptur3d})\n - whoami       : Show current visitor session info\n - clear        : Clear terminal screen`;
    } else if (lowerCmd === "status") {
      output = `[+] EVENT: Rynex Eclipse 2026 (Jeopardy CTF)\n[+] STATUS: Pre-Registration Active\n[+] VENUE: Rahim Yar Khan, Pakistan\n[+] FEE: PKR 500 per participant\n[+] ELIGIBILITY: Open to Students, Pros, Ethical Hackers & Developers`;
    } else if (lowerCmd === "tracks" || lowerCmd === "categories") {
      output = `[+] 1. WEB EXPLOITATION   (OWASP Top 10, API Hacking, XSS, SQLi, JWT)\n[+] 2. DIGITAL FORENSICS  (Network PCAP, RAM Dumps, Metadata Analysis)\n[+] 3. REVERSE ENG        (Assembly, Ghidra, Decompilation, Anti-Debug)\n[+] 4. NETWORK SECURITY   (Wireshark, Encrypted Channels, Pivoting)`;
    } else if (lowerCmd === "rules") {
      output = `[*] RYNEX ECLIPSE CTF RULES:\n 1. Flag format: RYNEX{some_secret_text}\n 2. Do not attack event infrastructure or host servers outside challenge targets.\n 3. Sharing flags or solution code between competing teams is strictly prohibited.\n 4. First Blood bonus: +50 PTS awarded to the first solver of each challenge.`;
    } else if (lowerCmd === "prizes" || lowerCmd === "rewards") {
      output = `[+] PRIZE POOL & HONORS:\n - Cash Rewards & Winner Trophies for Top Teams\n - Verified Official Certificates of Excellence for Top Performers\n - Direct Recruitment & Talent Pipeline to Partner Security Sponsors`;
    } else if (lowerCmd === "register" || lowerCmd === "signup") {
      output = "[>] Opening Competitor Pre-Registration Form...";
      setTimeout(() => {
        setRegSuccess(null);
        setRegisterModalOpen(true);
      }, 250);
    } else if (lowerCmd === "sponsor" || lowerCmd === "partner") {
      output = "[>] Opening Sponsorship Inquiry Modal...";
      setTimeout(() => {
        setSponsorSuccess(false);
        setSponsorModalOpen(true);
      }, 250);
    } else if (lowerCmd === "whoami") {
      output = "USER: Guest Hacker | ROLE: Event Visitor | PERMISSION: Pre-Registration Eligible";
    } else if (lowerCmd === "clear" || lowerCmd === "cls") {
      setTerminalHistory([]);
      setTerminalInput("");
      return;
    } else if (lowerCmd.includes("rynex{3cl1ps3_2026_c4ptur3d}")) {
      output = `[+] FLAG ACCEPTED! [RYNEX{3cl1ps3_2026_c4ptur3d}]\n[+] Result: CORRECT ANSWER\n[+] Score: +500 PTS (First Blood Bonus Included)\n[+] Next Step: Click 'Pre-Register' to reserve your spot in the live championship!`;
    } else if (lowerCmd.includes("rynex{w3b_3xp1o1t_pwn3d}")) {
      output = `[+] FLAG ACCEPTED! [RYNEX{w3b_3xp1o1t_pwn3d}]\n[+] Category: Web Exploitation\n[+] Score: +300 PTS`;
    } else if (lowerCmd.startsWith("submit")) {
      output = "[-] INVALID FLAG FORMAT OR WRONG FLAG.\nHint: Try testing 'RYNEX{3cl1ps3_2026_c4ptur3d}' or type 'help'.";

    } else {
      output = `Command '${cmd}' not recognized. Type 'help' for available commands.`;
    }

    setTerminalHistory((prev) => [...prev, { cmd, output }]);
    setCmdHistory((prev) => [...prev, cmd]);
    setCmdHistoryIdx(-1);
    setTerminalInput("");
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runTerminalCommand(terminalInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = cmdHistoryIdx === -1 ? cmdHistory.length - 1 : Math.max(0, cmdHistoryIdx - 1);
      setCmdHistoryIdx(nextIdx);
      setTerminalInput(cmdHistory[nextIdx] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cmdHistoryIdx === -1) return;
      const nextIdx = cmdHistoryIdx + 1;
      if (nextIdx >= cmdHistory.length) {
        setCmdHistoryIdx(-1);
        setTerminalInput("");
      } else {
        setCmdHistoryIdx(nextIdx);
        setTerminalInput(cmdHistory[nextIdx] || "");
      }
    }
  };

  // Competitor Submit
  const handleRegSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regForm),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setRegSuccess(data.ticketToken);
      } else {
        alert(data.error || "Failed to submit registration. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sponsor Submit
  const handleSponsorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/events/sponsor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sponsorForm),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setSponsorSuccess(true);
      } else {
        alert(data.error || "Failed to submit sponsorship inquiry. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedAudienceData = targetAudience.find((a) => a.id === activeAudience) || targetAudience[0];

  return (
    <div className={styles.eventsContainer}>
      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <NetworkBackground />
        <div className={styles.heroInner}>
          <div className={styles.badgeRow}>
          <span className={styles.cyberBadge}>
            <span className={styles.pulsingDot} /> FLAGSHIP COMPETITION 2026
          </span>
          <span className={styles.cyberBadge}>
            <i className="fas fa-flag" /> JEOPARDY CTF FORMAT
          </span>
          <span className={styles.cyberBadge}>
            <i className="fas fa-location-dot" /> RAHIM YAR KHAN, PAKISTAN
          </span>
        </div>

        <h1 className={styles.mainTitle}>RYNEX ECLIPSE 2026</h1>
        <div className={styles.tagline}>Think . Capture . Compete</div>

        <p className={styles.heroDescription}>
          Pakistan’s premier Capture The Flag (CTF) competition organized by Rynex Security.
          Gathering over 200+ top university students, ethical hackers, SOC analysts, and technology
          enthusiasts to solve real-world cybersecurity challenges under competitive pressure.
        </p>

        {/* HERO STATS */}
        <div className={styles.heroStatsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>200+</div>
            <div className={styles.statLabel}>Expected Competitors</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>PKR 500</div>
            <div className={styles.statLabel}>Registration Fee</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>2026</div>
            <div className={styles.statLabel}>Event Year</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>Rahim Yar Khan</div>
            <div className={styles.statLabel}>Host City, Pakistan</div>
          </div>
        </div>

        {/* CTA BUTTONS */}
        <div className={styles.heroCtaRow}>
          <button
            type="button"
            className={styles.primaryCtaBtn}
            onClick={() => {
              setRegSuccess(null);
              setRegisterModalOpen(true);
            }}
          >
            <i className="fas fa-user-plus" /> Register as Competitor (PKR 500)
          </button>

          <button
            type="button"
            className={styles.secondaryCtaBtn}
            onClick={() => {
              setSelectedTier("Title Sponsor");
              setSponsorForm((prev) => ({ ...prev, tier: "Title Sponsor" }));
              setSponsorSuccess(false);
              setSponsorModalOpen(true);
            }}
          >
            <i className="fas fa-handshake" /> Become a Sponsor / Partner
          </button>
        </div>

        {/* CTF TERMINAL SIMULATOR */}
        <div className={styles.terminalContainer} onClick={() => terminalInputRef.current?.focus()}>
          <div className={styles.terminalHeader}>
            <div className={styles.terminalDots}>
              <span className={`${styles.terminalDot} ${styles.dotRed}`} />
              <span className={`${styles.terminalDot} ${styles.dotYellow}`} />
              <span className={`${styles.terminalDot} ${styles.dotGreen}`} />
            </div>
            <div className={styles.terminalTitle}>
              <i className="fas fa-terminal" aria-hidden="true" /> rynex-eclipse-ctf@gateway:~#
            </div>
          </div>

          <div className={styles.terminalBody}>
            {/* Quick Command Shortcuts */}
            <div className={styles.terminalQuickRow} onClick={(e) => e.stopPropagation()}>
              <span className={styles.quickLabel}>Quick Run:</span>
              <button type="button" onClick={() => runTerminalCommand("help")} className={styles.quickCmdBtn}>help</button>
              <button type="button" onClick={() => runTerminalCommand("status")} className={styles.quickCmdBtn}>status</button>
              <button type="button" onClick={() => runTerminalCommand("tracks")} className={styles.quickCmdBtn}>tracks</button>
              <button type="button" onClick={() => runTerminalCommand("rules")} className={styles.quickCmdBtn}>rules</button>
              <button type="button" onClick={() => runTerminalCommand("prizes")} className={styles.quickCmdBtn}>prizes</button>
              <button type="button" onClick={() => runTerminalCommand("register")} className={styles.quickCmdBtn}>register</button>
              <button type="button" onClick={() => runTerminalCommand("submit RYNEX{3cl1ps3_2026_c4ptur3d}")} className={styles.quickCmdBtn}>test flag</button>
              <button type="button" onClick={() => runTerminalCommand("clear")} className={styles.quickCmdBtn}>clear</button>
            </div>

            {terminalHistory.map((item, idx) => (
              <div key={idx} className={styles.terminalLine}>
                <div>
                  <span className={styles.terminalPrompt}>rynex-ctf&gt;</span> {item.cmd}
                </div>
                <div style={{ whiteSpace: "pre-wrap", color: "#e2e8f0", marginTop: "4px" }}>
                  {item.output}
                </div>
              </div>
            ))}
            <div ref={terminalEndRef} />

            <form onSubmit={handleTerminalSubmit} className={styles.terminalInputRow} onClick={(e) => e.stopPropagation()}>
              <span className={styles.terminalPrompt}>rynex-ctf&gt;</span>
              <input
                ref={terminalInputRef}
                type="text"
                className={styles.terminalInput}
                placeholder="Type command or test flag (e.g. RYNEX{3cl1ps3_2026_c4ptur3d}). Use ↑/↓ for history."
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="CTF Terminal Input"
              />
            </form>
          </div>
        </div>
      </div>
    </section>

      {/* CTF CATEGORIES / TRACKS SECTION */}
      <section className={styles.sectionWrapper}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionSubtitle}>01 — CHALLENGE CATEGORIES</div>
          <h2 className={styles.sectionTitle}>Real-World Cybersecurity Scenarios</h2>
          <p className={styles.sectionDesc}>
            Rynex Eclipse 2026 features Jeopardy-style CTF challenges designed by offensive security
            specialists to test practical, industry-relevant exploitation and defensive skills.
          </p>
        </div>

        <div className={styles.tracksGrid}>
          {ctfTracks.map((track, i) => (
            <div key={i} className={styles.trackCard}>
              <div className={styles.trackIconBox}>
                <i className={`fas ${track.icon}`} />
              </div>
              <h3 className={styles.trackTitle}>{track.title}</h3>
              <p className={styles.trackDesc}>{track.desc}</p>
              <div className={styles.trackTags}>
                {track.tags.map((t, tid) => (
                  <span key={tid} className={styles.trackTag}>
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TARGET AUDIENCE INTERACTIVE TABS */}
      <section className={styles.sectionWrapper}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionSubtitle}>02 — TARGET AUDIENCE</div>
          <h2 className={styles.sectionTitle}>Who Should Participate?</h2>
          <p className={styles.sectionDesc}>
            Designed to bring together Pakistan's full tech spectrum, from high-potential students
            to seasoned cyber security professionals and independent security researchers.
          </p>
        </div>

        <div className={styles.audienceContainer}>
          <div className={styles.audienceTabs}>
            {targetAudience.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.audienceTabBtn} ${activeAudience === item.id ? styles.audienceTabActive : ""
                  }`}
                onClick={() => setActiveAudience(item.id)}
              >
                <i className={`fas ${item.icon}`} style={{ marginRight: "8px" }} />
                {item.title}
              </button>
            ))}
          </div>

          <div className={styles.audienceContent}>
            <div className={styles.audienceText}>
              <h3>{selectedAudienceData.title}</h3>
              <p>{selectedAudienceData.description}</p>
              <ul className={styles.audienceList}>
                {selectedAudienceData.benefits.map((b, idx) => (
                  <li key={idx}>
                    <i className="fas fa-check-circle" /> {b}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  background: "rgba(0, 212, 255, 0.05)",
                  border: "1px solid rgba(0, 212, 255, 0.2)",
                  borderRadius: "12px",
                  padding: "32px",
                }}
              >
                <i className="fas fa-trophy" style={{ fontSize: "3rem", color: "#00d4ff", marginBottom: "16px" }} />
                <h4 style={{ color: "#ffffff", fontSize: "1.2rem", marginBottom: "8px" }}>
                  Elevate Your Career Path
                </h4>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: "1.6" }}>
                  Every participant receives an official verified certificate of participation,
                  with winners receiving cash prizes, trophies, and direct recruitment access to leading
                  cybersecurity sponsors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EVENT HIGHLIGHTS / PERKS */}
      <section className={styles.sectionWrapper}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionSubtitle}>03 — EVENT HIGHLIGHTS</div>
          <h2 className={styles.sectionTitle}>What Makes Rynex Eclipse Unique?</h2>
        </div>

        <div className={styles.perksGrid}>
          <div className={styles.perkCard}>
            <i className={`fas fa-award ${styles.perkIcon}`} />
            <div>
              <div className={styles.perkTitle}>Cash Prizes & Recognition</div>
              <div className={styles.perkDesc}>
                Exciting monetary awards, trophies, and certificates for top individual hackers and winning teams.
              </div>
            </div>
          </div>

          <div className={styles.perkCard}>
            <i className={`fas fa-chart-line ${styles.perkIcon}`} />
            <div>
              <div className={styles.perkTitle}>Live Jeopardy Scoreboard</div>
              <div className={styles.perkDesc}>
                Real-time scoreboard tracking team progress, dynamic points decay, and instant first-blood bonuses.
              </div>
            </div>
          </div>

          <div className={styles.perkCard}>
            <i className={`fas fa-briefcase ${styles.perkIcon}`} />
            <div>
              <div className={styles.perkTitle}>Recruitment & Hiring Pipeline</div>
              <div className={styles.perkDesc}>
                Pre-vetted talent exposure to top sponsor companies actively recruiting for SOC, Pen Testing & Security roles.
              </div>
            </div>
          </div>

          <div className={styles.perkCard}>
            <i className={`fas fa-network-wired ${styles.perkIcon}`} />
            <div>
              <div className={styles.perkTitle}>Professional Networking</div>
              <div className={styles.perkDesc}>
                Direct interaction with sponsors, industry veterans, security researchers, and high-energy competitors.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SPONSORSHIP INVESTMENT & TIERS SECTION */}
      <section className={styles.sectionWrapper}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionSubtitle}>04 — SPONSORSHIP OPPORTUNITIES</div>
          <h2 className={styles.sectionTitle}>Partner With Rynex Eclipse 2026</h2>
          <p className={styles.sectionDesc}>
            Position your organization prominently in front of Pakistan's cybersecurity ecosystem.
            Engage with top-tier technical talent, showcase your brand, and fulfill CSR objectives.
          </p>
        </div>

        {/* Sponsor Tier Carousel — 2 cards visible, auto-scroll infinite loop */}
        <div
          className={styles.sponsorCarouselOuter}
          onMouseEnter={() => { if (autoScrollRef.current) clearInterval(autoScrollRef.current); }}
          onMouseLeave={startAutoScroll}
        >
          {/* Arrow — Prev */}
          <button type="button" className={styles.carouselArrow} onClick={goCarouselPrev} aria-label="Previous sponsor tier">
            <i className="fas fa-chevron-left" />
          </button>

          {/* Sliding track stage */}
          <div className={styles.sponsorCarouselStage} ref={stageRef}>
            <div
              className={styles.sponsorCarouselTrack}
              style={{
                transform: `translateX(-${carouselOffset * slideWidth}px)`,
                transition: carouselAnimate ? "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
              }}
            >
              {carouselItems.map((tier, idx) => {
                const tierIconIdx = idx % sponsorTiers.length;
                return (
                  <div
                    key={idx}
                    className={`${styles.sponsorCarouselCard} ${tier.featured ? styles.sponsorTierCardFeatured : ""}`}
                  >
                    {tier.badge && <span className={styles.tierRibbon}>{tier.badge}</span>}

                    <div className={styles.carouselTierIcon}>
                      {tierIconIdx === 0 && <i className="fas fa-crown" />}
                      {tierIconIdx === 1 && <i className="fas fa-gem" />}
                      {tierIconIdx === 2 && <i className="fas fa-medal" />}
                      {tierIconIdx === 3 && <i className="fas fa-shield-halved" />}
                      {tierIconIdx === 4 && <i className="fas fa-hands-holding-circle" />}
                    </div>

                    <div className={styles.carouselTierLabel}>{tier.tier}</div>
                    <h3 className={styles.carouselTierName}>{tier.name}</h3>
                    <div className={styles.carouselTierPrice}>
                      {tier.price}
                      <span className={styles.tierPriceSub}> / event</span>
                    </div>

                    <div className={styles.carouselDivider} />

                    <ul className={styles.carouselFeatureList}>
                      {tier.features.map((f, fid) => (
                        <li key={fid}>
                          <span className={styles.carouselCheckIcon}><i className="fas fa-check" /></span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      className={`${styles.sponsorActionBtn} ${tier.featured ? styles.sponsorActionBtnFeatured : ""}`}
                      onClick={() => {
                        setSelectedTier(tier.name);
                        setSponsorForm((prev) => ({ ...prev, tier: tier.name }));
                        setSponsorSuccess(false);
                        setSponsorModalOpen(true);
                      }}
                    >
                      <i className="fas fa-handshake" /> Inquire {tier.name}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Arrow — Next */}
          <button type="button" className={styles.carouselArrow} onClick={goCarouselNext} aria-label="Next sponsor tier">
            <i className="fas fa-chevron-right" />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className={styles.carouselDots}>
          {sponsorTiers.map((tier, idx) => (
            <button
              key={idx}
              type="button"
              className={`${styles.carouselDot} ${idx === activeDotIdx ? styles.carouselDotActive : ""}`}
              onClick={() => { startAutoScroll(); setCarouselOffset(idx); }}
              aria-label={`Go to ${tier.name}`}
            />
          ))}
        </div>

        {/* Detailed Benefits Comparison Table */}
        <div style={{ marginTop: "60px" }}>
          <h3 style={{ color: "#ffffff", fontSize: "1.4rem", marginBottom: "20px", textAlign: "center" }}>
            Comprehensive Sponsorship Feature Matrix
          </h3>
          <div className={styles.benefitsTableWrapper}>
            <table className={styles.benefitsTable}>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Title Sponsor</th>
                  <th>Platinum</th>
                  <th>Gold</th>
                  <th>Silver</th>
                  <th>Community</th>
                </tr>
              </thead>
              <tbody>
                {benefitsMatrix.map((row, rIdx) => (
                  <tr key={rIdx}>
                    <td className={styles.featureCol}>{row.feature}</td>
                    <td>{row.title}</td>
                    <td>{row.platinum}</td>
                    <td>{row.gold}</td>
                    <td>{row.silver}</td>
                    <td>{row.community}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className={styles.sectionWrapper}>
        <div className={styles.ctaBanner}>
          <h2 className={styles.ctaBannerTitle}>Ready to Think, Capture, and Compete?</h2>
          <p className={styles.ctaBannerText}>
            Join Pakistan's flagship Capture The Flag competition. Limited competitor slots and
            sponsorship allocations available on a first-confirmed basis.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <button
              type="button"
              className={styles.primaryCtaBtn}
              onClick={() => {
                setRegSuccess(null);
                setRegisterModalOpen(true);
              }}
            >
              <i className="fas fa-bolt" /> Register Now — PKR 500
            </button>
            <button
              type="button"
              className={styles.secondaryCtaBtn}
              onClick={() => {
                setSponsorSuccess(false);
                setSponsorModalOpen(true);
              }}
            >
              <i className="fas fa-file-pdf" /> Request Sponsorship Proposal
            </button>
          </div>
        </div>


      </section>

      {/* COMPETITOR REGISTRATION MODAL */}
      {registerModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setRegisterModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={() => setRegisterModalOpen(false)}
            >
              <i className="fas fa-times" />
            </button>

            {!regSuccess ? (
              <>
                <h3 className={styles.modalTitle}>Competitor Pre-Registration</h3>
                <p className={styles.modalSub}>
                  Rynex Eclipse 2026 | Registration Fee: <strong>PKR 500 per participant</strong>
                </p>

                <form onSubmit={handleRegSubmit}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Full Name</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      required
                      placeholder="e.g. Hamza Ahmed"
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email Address</label>
                    <input
                      type="email"
                      className={styles.formInput}
                      required
                      placeholder="e.g. competitor@domain.com"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>WhatsApp / Phone Number</label>
                    <input
                      type="tel"
                      className={styles.formInput}
                      required
                      placeholder="03XXXXXXXXX"
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Participant Category</label>
                    <select
                      className={styles.formSelect}
                      value={regForm.category}
                      onChange={(e) => setRegForm({ ...regForm, category: e.target.value })}
                    >
                      <option value="University Student">University Student</option>
                      <option value="Cyber Security Professional">Cyber Security Professional</option>
                      <option value="Ethical Hacker / Researcher">Ethical Hacker / Researcher</option>
                      <option value="Software Engineer / Developer">Software Engineer / Developer</option>
                      <option value="IT / System Administrator">IT / System Administrator</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>University / Organization Name</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="e.g. FAST / NUST / Freelance"
                      value={regForm.organization}
                      onChange={(e) => setRegForm({ ...regForm, organization: e.target.value })}
                    />
                  </div>

                  <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                    {isSubmitting ? "Processing Registration..." : "Confirm & Submit Registration (PKR 500)"}
                  </button>
                </form>
              </>
            ) : (
              <div className={styles.successCard}>
                <i className={`fas fa-check-circle ${styles.successIcon}`} />
                <h3 className={styles.modalTitle}>Registration Pre-Confirmed!</h3>
                <p className={styles.modalSub}>
                  Thank you, <strong>{regForm.name}</strong>. Your spot for Rynex Eclipse 2026 has been registered.
                </p>

                <div className={styles.tokenBadge}>Reg Token: {regSuccess}</div>

                <p style={{ color: "#94a3b8", fontSize: "0.875rem", marginBottom: "20px" }}>
                  Payment instructions for PKR 500 registration fee and CTF portal credentials will be sent to <strong>{regForm.email}</strong>.
                </p>

                <button
                  type="button"
                  className={styles.submitBtn}
                  onClick={() => setRegisterModalOpen(false)}
                >
                  Close & Return to Event Page
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SPONSOR INQUIRY MODAL */}
      {sponsorModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setSponsorModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={() => setSponsorModalOpen(false)}
            >
              <i className="fas fa-times" />
            </button>

            {!sponsorSuccess ? (
              <>
                <h3 className={styles.modalTitle}>Sponsorship & Partnership Inquiry</h3>
                <p className={styles.modalSub}>
                  Selected Tier: <strong>{sponsorForm.tier}</strong> | Rynex Eclipse 2026
                </p>

                <form onSubmit={handleSponsorSubmit}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Organization / Company Name</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      required
                      placeholder="e.g. CyberCorp Solutions"
                      value={sponsorForm.companyName}
                      onChange={(e) => setSponsorForm({ ...sponsorForm, companyName: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Contact Person Name</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      required
                      placeholder="e.g. Hamza Zahid"
                      value={sponsorForm.contactName}
                      onChange={(e) => setSponsorForm({ ...sponsorForm, contactName: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Official Email Address</label>
                    <input
                      type="email"
                      className={styles.formInput}
                      required
                      placeholder="sponsor@company.com"
                      value={sponsorForm.email}
                      onChange={(e) => setSponsorForm({ ...sponsorForm, email: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Phone Number</label>
                    <input
                      type="tel"
                      className={styles.formInput}
                      required
                      placeholder="+92 3XX XXXXXXX"
                      value={sponsorForm.phone}
                      onChange={(e) => setSponsorForm({ ...sponsorForm, phone: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Preferred Sponsorship Package</label>
                    <select
                      className={styles.formSelect}
                      value={sponsorForm.tier}
                      onChange={(e) => setSponsorForm({ ...sponsorForm, tier: e.target.value })}
                    >
                      <option value="Title Sponsor">Title Sponsor (PKR 200,000)</option>
                      <option value="Platinum Sponsor">Platinum Sponsor (PKR 100,000)</option>
                      <option value="Gold Sponsor">Gold Sponsor (PKR 50,000)</option>
                      <option value="Silver Sponsor">Silver Sponsor (PKR 25,000)</option>
                      <option value="Community Partner">Community Partner (In-Kind)</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Message or Customized Request (Optional)</label>
                    <textarea
                      className={styles.formTextarea}
                      rows={3}
                      placeholder="Let us know any custom requirements or questions..."
                      value={sponsorForm.message}
                      onChange={(e) => setSponsorForm({ ...sponsorForm, message: e.target.value })}
                    />
                  </div>

                  <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                    {isSubmitting ? "Submitting Inquiry..." : `Submit ${sponsorForm.tier} Inquiry`}
                  </button>
                </form>
              </>
            ) : (
              <div className={styles.successCard}>
                <i className={`fas fa-handshake ${styles.successIcon}`} />
                <h3 className={styles.modalTitle}>Inquiry Successfully Sent!</h3>
                <p className={styles.modalSub}>
                  Thank you, <strong>{sponsorForm.companyName}</strong>. Our partnership team will reach out to <strong>{sponsorForm.email}</strong> within 24 hours.
                </p>

                <div style={{ background: "rgba(0, 212, 255, 0.08)", padding: "16px", borderRadius: "8px", color: "#00d4ff", marginBottom: "20px" }}>
                  Direct Contact: info@rynexsecurity.com | +92 327 287 3812
                </div>

                <button
                  type="button"
                  className={styles.submitBtn}
                  onClick={() => setSponsorModalOpen(false)}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
