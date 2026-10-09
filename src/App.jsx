/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║        NAVEEN KASHYAP — PORTFOLIO                            ║
 * ║        Dark Neomorphism (Soft UI) · React + Tailwind CSS v4   ║
 * ╠══════════════════════════════════════════════════════════════╣
 * ║  Requires  src/index.css  (Tailwind v4 @theme tokens)        ║
 * ║  Assets    /public/Naveen-Kashyap.jpg                         ║
 * ║            /public/Naveen_Kashyap_Resume.pdf                  ║
 * ║  Features  Dark/Light toggle · AI assistant · custom cursor   ║
 * ║            scroll-spy nav · per-tech colors · memoized        ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* ═══════════════════════════════════════════
   DATA  (edit here — content lives outside the components)
   ═══════════════════════════════════════════ */

const PHOTO = "/Naveen-Kashyap.jpg";
const RESUME = "/Naveen_Kashyap_Resume.pdf";

const NAV_LINKS = [
  { id: "about", label: "About", hover: "hover:text-[#a78bfa]" },
  { id: "skills", label: "Skills", hover: "hover:text-[#67e8f9]" },
  { id: "projects", label: "Projects", hover: "hover:text-[#f472b6]" },
  { id: "experience", label: "Experience", hover: "hover:text-[#fbbf24]" },
  { id: "contact", label: "Contact", hover: "hover:text-[#4ade80]" },
];

const ROLES = [
  "Full Stack Developer",
  "Generative AI Developer",
  "MERN Stack Developer",
  "Microservices Engineer",
  "Frontend Developer",
];

const STATS = [
  { value: "1+", label: "Year Experience" },
  { value: "11+", label: "Projects Built" },
  { value: "7.1", label: "CGPA / 10" },
];

const FEATURES = [
  {
    icon: "⚡",
    title: "Full-Stack Development",
    desc: "End-to-end MERN applications — REST APIs, JWT & OAuth 2.0 authentication, MongoDB and PostgreSQL data layers.",
  },
  {
    icon: "🤖",
    title: "Real-Time & AI Powered",
    desc: "WebRTC video calling, Socket.IO chat, and AI features powered by Google Gemini and Claude APIs.",
  },
  {
    icon: "🚀",
    title: "Scalable & Secure",
    desc: "Microservices with Apache Kafka, Redis caching, rate limiting, Docker Compose and Razorpay payments.",
  },
];

/* Your skills — SpringBoot removed; Prisma / Redis / Docker added (used in projects) */
const SKILLS = {
  Frontend: [
    "React.js",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Three.js",
    "Framer Motion",
    "JavaScript (ES6+)",
    "HTML5 / CSS3",
    "Bootstrap",
  ],
  Backend: [
    "Node.js",
    "Express.js",
    "REST API",
    "WebSocket / Socket.io",
    "Prisma",
    "Redis",
    "Docker",
  ],
  Database: ["MongoDB", "SQL", "PostgreSQL"],
  Tools: [
    "Git / GitHub",
    "Firebase",
    "VSCode",
    "Java",
    "Python",
    "Postman",
    "IntelliJ IDEA",
    "Vercel",
    "Netlify",
    "MongoDB Atlas",
  ],
  "Generative AI": [
    "Google Gemini ",
    "OpenAI ",
    "Claude ",
    "Prompt Engineering",
    "RAG",
    "n8n",
    "LLM",
    "AI-Powered Features",
  ],
};

/* Per-technology brand colors: [dark-theme, light-theme] */
const TECH_COLORS = {
  "React.js": ["#61dafb", "#0891b2"],
  "Next.js": ["#eceef2", "#1f2937"],
  TypeScript: ["#519aba", "#1d4ed8"],
  "Tailwind CSS": ["#38bdf8", "#0284c7"],
  "Three.js": ["#d9d9d9", "#333333"],
  "Framer Motion": ["#f472b6", "#db2777"],
  "JavaScript (ES6+)": ["#f7df1e", "#a16207"],
  "HTML5 / CSS3": ["#e34f26", "#c2410c"],
  Bootstrap: ["#9775da", "#6f42c1"],
  "Node.js": ["#8cc84b", "#4d7c0f"],
  "Express.js": ["#c8ccd4", "#374151"],
  "REST API": ["#fb923c", "#c2410c"],
  "WebSocket / Socket.io": ["#c084fc", "#7e22ce"],
  Prisma: ["#4fd1c5", "#0f766e"],
  Redis: ["#f87171", "#b91c1c"],
  Docker: ["#2496ed", "#0369a1"],
  MongoDB: ["#5ecd62", "#15803d"],
  SQL: ["#facc15", "#a16207"],
  PostgreSQL: ["#00b4d8", "#0e7490"],
  "Git / GitHub": ["#f97316", "#c2410c"],
  Firebase: ["#ffca28", "#b45309"],
  VSCode: ["#4db8ff", "#0078d4"],
  Java: ["#fb923c", "#9a3412"],
  Python: ["#4b8bbe", "#1d4ed8"],
  Postman: ["#ff6c37", "#c2410c"],
  "IntelliJ IDEA": ["#f472b6", "#be185d"],
  Vercel: ["#eceef2", "#111827"],
  Netlify: ["#2dd4bf", "#0f766e"],
  "MongoDB Atlas": ["#5ecd62", "#15803d"],
  "Google Gemini ": ["#8ab4f8", "#1a73e8"],
  "OpenAI ": ["#10a37f", "#0b7a5c"],
  "Claude ": ["#d97757", "#b4533a"],
  "Prompt Engineering": ["#a78bfa", "#7c3aed"],
  RAG: ["#5eead4", "#0f766e"],
  n8n: ["#ea4b71", "#be185d"],
  "AI-Powered Features": ["#67e8f9", "#0891b2"],
};

const techStyle = (name) => {
  const [d, l] = TECH_COLORS[name] || ["#a78bfa", "#7c3aed"];
  return { "--chip": d, "--chip-light": l, "--glow-d": `${d}66`, "--glow-l": `${l}55` };
};

const MINI_PROJECTS = [
  {
    title: "WeatherAI-App",
    subtitle: "Real-Time Weather Tracker",
    year: "2025",
    stack: ["React.js", "OpenWeather API", "CSS3", "JavaScript"],
    points: [
      "Live weather via OpenWeather API with location search and auto-detect geolocation",
      "Displays temp, humidity, wind speed & 5-day forecast with animated weather icons",
    ],
    icon: "🌤️",
    github: "https://github.com/naveenkashyap2/WeatherAI1",
    demo: "https://weather-ai-uxbg.vercel.app/",
  },
  {
    title: "AI-Integrated Todo",
    subtitle: "Task Management App",
    year: "2025-26",
    stack: ["React.js", "LocalStorage", "Tailwind CSS", "JavaScript"],
    points: [
      "Full CRUD task manager with priority levels, due dates, and category filters",
      "Persistent state via LocalStorage; smooth animations for add/delete/complete",
    ],
    icon: "✅",
    github: "https://github.com/naveenkashyap2/modern-todo",
    demo: "https://novatodo2.netlify.app/",
  },
  {
    title: "Neon-Chat App",
    subtitle: "Real-Time Messaging",
    year: "2025-26",
    stack: ["React.js", "Socket.io", "Node.js", "Express.js"],
    points: [
      "Real-time bi-directional messaging using Socket.io with room-based chat support",
      "Online user indicators, typing status, message timestamps and emoji support",
    ],
    icon: "💬",
    github: "https://github.com/naveenkashyap2",
    demo: "https://neon-chat-3.onrender.com/",
  },
  {
    title: "Mini E-Commerce",
    subtitle: "Shopping Store UI",
    year: "2025",
    stack: ["React.js", "Tailwind CSS", "Context API", "JavaScript"],
    points: [
      "Product listing, search, filter by category & price range with cart functionality",
      "Context API for global cart state; responsive grid layout with product detail modal",
    ],
    icon: "🛍️",
    github: "https://github.com/naveenkashyap2",
    demo: "#",
  },
  {
    title: "Resumify AI",
    subtitle: "AI Resume Builder Platform",
    year: "2026",
    stack: ["React.js", "Tailwind CSS", "Framer Motion", "Canva", "JavaScript"],
    points: [
      "AI-powered ATS Resume Builder with live preview",
      "Responsive UI, smooth animations & modern templates",
      "PDF export, real-time editing & seamless UX",
    ],
    icon: "📄",
    github: "https://github.com/naveenkashyap2/Resume-builder",
    demo: "https://resume-builder-74fb.vercel.app/",
  },
  {
    title: "DashFlow",
    subtitle: "Modern Admin Dashboard",
    year: "2026",
    stack: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    points: [
      "Responsive admin dashboard with analytics and user management",
      "Smooth animations, dark mode, and modern UI components",
    ],
    icon: "📊",
    github: "https://github.com/naveenkashyap2/user-dash",
    demo: "https://user-dash-orcin.vercel.app/",
  },
];

/* Major projects first — Streamify · Railway · CareerAI lead */
const MAJOR_PROJECTS = [
  {
    title: "Streamify",
    subtitle: "Video & Chat Calling App",
    year: "2026",
    stack: [
      "React.js",
      "Node.js",
      "MongoDB",
      "WebRTC",
      "Socket.io",
      "TailwindCSS",
      "JWT Auth",
      "Express.js",
    ],
    points: [
      "Full-stack real-time video & chat platform using MERN + WebRTC for peer-to-peer streaming",
      "JWT auth, MongoDB-backed user profiles & call history, responsive Tailwind CSS UI",
    ],
    icon: "📡",
    github: "https://github.com/naveenkashyap2/streamify-video-call",
    demo: "https://neon-chat-3.onrender.com/",
  },
  /* ✨ From resume */
  {
    title: "Railway Ticket Booking",
    subtitle: "Microservices Architecture · Ongoing",
    year: "2026",
    stack: [
      "Node.js",
      "Express.js",
      "React",
      "PostgreSQL",
      "Prisma",
      "Redis",
      "Apache Kafka",
      "Elasticsearch",
      "Docker",
      "Razorpay",
    ],
    points: [
      "Scalable microservices with API Gateway and database-per-service architecture",
      "JWT auth, OTP verification, Google OAuth, RBAC, rate limiting & circuit breakers",
      "Event-driven booking & payment workflows with Apache Kafka, Saga orchestration & DLQ",
      "Redis-based distributed seat locking; Razorpay payments, webhooks & refunds",
      "Elasticsearch-powered train/station search; full Docker Compose infra (Kafka, Redis, Kibana)",
    ],
    icon: "🚄",
    github: "https://github.com/naveenkashyap2",
    demo: "#",
  },
  /* ✨ From resume */
  {
    title: "CareerAI",
    subtitle: "AI-Powered Career Platform",
    year: "2026",
    stack: ["MERN", "Google Gemini API", "Google OAuth", "MongoDB"],
    points: [
      "Full-stack AI career platform — resume analysis, job matching, resume creation & interview prep",
      "Secure Google OAuth authentication with personalized user session management",
      "AI Resume Analyzer with ATS scoring, keyword-gap detection & section-wise feedback",
      "ATS-friendly PDF resume generation with real-time editing",
    ],
    icon: "🧭",
    github: "https://github.com/naveenkashyap2",
    demo: "#",
  },
  {
    title: "AI Code Generator",
    subtitle: "OpenAI-Powered Dev Tool",
    year: "2026",
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "OpenAI API"],
    points: [
      "AI-powered code generation tool — generate, preview, and copy production-ready code",
      "User history dashboard with MongoDB; Express.js API routes handle prompt pipelines",
    ],
    icon: "🤖",
    github: "https://github.com/naveenkashyap2",
    demo: "#",
  },
  {
    title: "E-Commerce Platform",
    subtitle: "Next.js Full-Stack Store",
    year: "2025–26",
    stack: ["Next.js", "React.js", "Tailwind CSS", "Node.js", "MongoDB"],
    points: [
      "SSR/SSG for SEO, product listing, cart, secure multi-step checkout with payment gateway",
      "90+ Google Lighthouse score via lazy loading, Next.js Image optimization, code splitting",
    ],
    icon: "🛒",
    github: "https://github.com/naveenkashyap2",
    demo: "#",
  },
];

/* ✨ From resume — Experience */
const EXPERIENCE = {
  role: "Front-End Developer Intern",
  org: "CODEXINTERN",
  period: "May 2025 – Sep 2025",
  points: [
    "Developed responsive and reusable React.js components using JavaScript, Tailwind CSS, and Bootstrap",
    "Built interactive user interfaces following modern React.js development practices",
    "Integrated REST APIs to fetch, process, and display dynamic application data",
    "Gained hands-on backend experience by building APIs with Node.js and Express.js",
    "Worked with MongoDB for storing and managing application data and integrating it with backend APIs",
    "Debugged application issues and optimized frontend functionality, responsiveness, and overall user experience",
  ],
};

/* ✨ From resume — Education */
const EDUCATION = {
  degree: "B.Tech — Computer Science & Engineering",
  org: "Apollo Institute of Technology (AIT), Kanpur",
  period: "2022 – 2026",
  cgpa: "7.1 / 10",
  rank: "Top 5%",
  note: "Active participant in technical clubs and inter-college coding contests",
};

/* ✨ From resume — Certifications */
const CERTIFICATIONS = [
  "☁️ Microsoft Certified: Azure Fundamentals (AZ-900)",
  "🏏 Best Performer — Cricket, AIT",
  "🎯 Top 5% Class Rank",
];

const INFO_ROWS = [
  { icon: "📍", text: "Kanpur, Uttar Pradesh, India" },
  { icon: "🎓", text: "B.Tech CSE · AIT Kanpur (2026)" },
  { icon: "📧", text: "nk1910479@gmail.com" },
  { icon: "📱", text: "+91 8467817027" },
];

const CONTACT_ROWS = [
  { icon: "📧", label: "Email", value: "nk1910479@gmail.com" },
  { icon: "📱", label: "Phone", value: "+91 8467817027" },
  { icon: "📍", label: "Location", value: "Kanpur, Uttar Pradesh, India" },
];

/* Professional brand colors: [dark-theme, light-theme] */
const SOCIALS = [
  { label: "LinkedIn", link: "https://www.linkedin.com/in/naveen-kashyap08/", colors: ["#4ba3f5", "#0a66c2"] },
  { label: "GitHub", link: "https://github.com/naveenkashyap2", colors: ["#e6edf3", "#181717"] },
  { label: "LeetCode", link: "https://leetcode.com/naveenkyp854", colors: ["#ffa116", "#b45309"] },
  { label: "YouTube", link: "https://www.youtube.com/@naveen08vlog", colors: ["#ff4d4d", "#dc2626"] },
  { label: "Instagram", link: "https://www.instagram.com/naveenkashyap2130", colors: ["#e1306c", "#be185d"] },
];

const socialStyle = (s) => ({
  "--chip": s.colors[0],
  "--chip-light": s.colors[1],
  "--glow-d": `${s.colors[0]}66`,
  "--glow-l": `${s.colors[1]}55`,
});

/* Flattened tech list for the marquee strip */
const ALL_TECH = Object.values(SKILLS).flat();

/* ═══════════════════════════════════════════
   ACCENT SYSTEM (violet / cyan, per palette)
   Full literal class strings so Tailwind v4
   can detect every utility at build time.
   ═══════════════════════════════════════════ */
const ACCENTS = {
  violet: {
    text: "text-neo-violet",
    bullet: "text-neo-violet",
    badge: "bg-neo-violet",
    sweep: "bg-[radial-gradient(circle_at_85%_-20%,rgba(167,139,250,0.16),transparent_55%)]",
    cardHover: "hover:shadow-neo-hover",
    iconGlow: "group-hover:shadow-neo-in-glow",
    btnVars: { "--glow": "rgba(167,139,250,0.45)", "--hc": "#a78bfa" },
  },
  cyan: {
    text: "text-neo-cyan",
    bullet: "text-neo-cyan",
    badge: "bg-neo-cyan",
    sweep: "bg-[radial-gradient(circle_at_85%_-20%,rgba(103,232,249,0.16),transparent_55%)]",
    cardHover: "hover:shadow-neo-hover-cyan",
    iconGlow: "group-hover:shadow-neo-in-glow-cyan",
    btnVars: { "--glow": "rgba(103,232,249,0.45)", "--hc": "#67e8f9" },
  },
};

const accentOf = (i) => (i % 2 === 0 ? ACCENTS.violet : ACCENTS.cyan);

/* ═══════════════════════════════════════════
   SHARED UI COMPONENTS
   ═══════════════════════════════════════════ */

/* Primary = gradient fill · Ghost = raised soft button.
   Every button gets its own hover color via --glow / --hc. */
const Button = memo(function Button({
  variant = "ghost",
  size = "md",
  href,
  download,
  onClick,
  className = "",
  glow,
  hc,
  children,
}) {
  const base =
    "btn-neo group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-[16px] font-bold uppercase tracking-[0.15em] active:translate-y-0";
  const sizes = { md: "px-7 py-3.5 text-xs", sm: "px-5 py-2.5 text-[11px]" };
  const variants = {
    primary:
      "bg-linear-to-r from-neo-violet to-neo-cyan text-[#1a1c22] shadow-neo-out-sm hover:brightness-110 active:shadow-neo-in",
    ghost: "bg-neo-bg text-neo-text shadow-neo-out-sm active:shadow-neo-in",
  };
  const style = {
    "--glow": glow || "rgba(167,139,250,0.4)",
    "--hc": hc || (variant === "primary" ? "#1a1c22" : "#a78bfa"),
  };
  const shine =
    variant === "primary" ? (
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-full"
      />
    ) : null;
  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;
  if (href) {
    return (
      <a href={href} download={download} onClick={onClick} style={style} className={classes}>
        {children}
        {shine}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} style={style} className={classes}>
      {children}
      {shine}
    </button>
  );
});

/* Small button used inside project cards */
const CardButton = memo(function CardButton({ href, variant, vars, children }) {
  const base =
    "btn-neo flex-1 rounded-[16px] px-3 py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.14em] shadow-neo-out-sm active:shadow-neo-in";
  const variants = {
    ghost: "text-neo-muted",
    primary: "bg-linear-to-r from-neo-violet to-neo-cyan text-[#1a1c22] hover:brightness-110",
  };
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={vars}
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </a>
  );
});

const SectionHeading = memo(function SectionHeading({ label, title }) {
  return (
    <div className="mb-12 flex flex-col items-center gap-4 text-center">
      <span className="rounded-[20px] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-neo-violet shadow-neo-out-sm">
        {label}
      </span>
      <h2 className="text-3xl font-black tracking-tight text-neo-text text-shadow-emboss sm:text-4xl">
        {title}
      </h2>
      <span
        aria-hidden="true"
        className="h-[3px] w-16 rounded-full bg-linear-to-r from-neo-violet to-neo-cyan shadow-neo-out-sm"
      />
    </div>
  );
});

const DividerLabel = memo(function DividerLabel({ emoji, label }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <span aria-hidden="true" className="h-[2px] flex-1 rounded-full shadow-neo-in-sm" />
      <span className="rounded-[20px] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-neo-muted shadow-neo-out-sm">
        {emoji} {label}
      </span>
      <span aria-hidden="true" className="h-[2px] flex-1 rounded-full shadow-neo-in-sm" />
    </div>
  );
});

/* Scroll-reveal wrapper (IntersectionObserver, plays once) */
const Reveal = memo(function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={show ? { animationDelay: `${delay}ms` } : undefined}
      className={`${show ? "animate-fade-up" : "reveal-hidden"} ${className}`}
    >
      {children}
    </div>
  );
});

/* Typewriter role text with blinking caret */
function Typewriter() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = ROLES[roleIdx];
    let t;
    if (!deleting && text === full) {
      t = setTimeout(() => setDeleting(true), 1500);
    } else if (deleting && text === "") {
      t = setTimeout(() => {
        setDeleting(false);
        setRoleIdx((i) => (i + 1) % ROLES.length);
      }, 250);
    } else {
      t = setTimeout(
        () => setText(deleting ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1)),
        deleting ? 35 : 70
      );
    }
    return () => clearTimeout(t);
  }, [text, deleting, roleIdx]);

  return (
    <span className="bg-linear-to-r from-neo-violet to-neo-cyan bg-clip-text text-sm font-extrabold uppercase tracking-[0.2em] text-transparent [background-size:200%_200%]">
      {text}
      <span aria-hidden="true" className="animate-caret text-neo-cyan">
        |
      </span>
    </span>
  );
}

/* Clickable tech chip — own brand color + glow on hover/click */
const TechChip = memo(function TechChip({ name }) {
  const [on, setOn] = useState(false);
  const toggle = useCallback(() => setOn((v) => !v), []);
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      style={techStyle(name)}
      className={`tech-chip rounded-[20px] px-3 py-1.5 text-[11px] font-semibold shadow-neo-in-sm ${on ? "chip-on" : ""}`}
    >
      {name}
    </button>
  );
});

const SkillCard = memo(function SkillCard({ category, tags, index }) {
  const a = accentOf(index);
  return (
    <article
      className={`group rounded-[28px] bg-neo-bg p-6 shadow-neo-out transition-all duration-500 ease-neo-spring hover:-translate-y-2 ${a.cardHover}`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-[14px] text-sm font-black text-[#1a1c22] shadow-neo-out-sm ${a.badge}`}
        >
          {category[0]}
        </span>
        <h3 className={`text-sm font-bold uppercase tracking-[0.18em] ${a.text}`}>{category}</h3>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {tags.map((t) => (
          <TechChip key={t} name={t} />
        ))}
      </div>
    </article>
  );
});

const ProjectCard = memo(function ProjectCard({ project, badge, index }) {
  const a = accentOf(index);
  const other = accentOf(index + 1);
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-[28px] bg-neo-bg p-6 shadow-neo-out transition-all duration-500 ease-neo-spring hover:-translate-y-2 ${a.cardHover}`}
    >
      {/* radial glow sweep on hover */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${a.sweep}`}
      />
      <div className="relative flex h-14 w-14 items-center justify-center rounded-[20px] text-3xl shadow-neo-in transition-transform duration-500 ease-neo-spring group-hover:-rotate-6">
        {project.icon}
      </div>
      <div className="relative mt-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-neo-text text-shadow-emboss">{project.title}</h3>
          <p className={`mt-0.5 text-[11px] font-bold uppercase tracking-[0.14em] ${a.text}`}>
            {project.subtitle}
          </p>
        </div>
        <span className="shrink-0 rounded-[20px] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-neo-muted shadow-neo-out-sm">
          {badge} · {project.year}
        </span>
      </div>
      <div className="relative mt-4 flex flex-wrap gap-1.5">
        {project.stack.map((s) => (
          <span
            key={s}
            style={techStyle(s)}
            className="tcol rounded-[10px] px-2 py-0.5 text-[10px] font-semibold tracking-wide shadow-neo-in-sm"
          >
            {s}
          </span>
        ))}
      </div>
      <ul className="relative mt-4 flex-1 space-y-2">
        {project.points.map((pt) => (
          <li key={pt} className="flex gap-2.5 text-[12.5px] leading-relaxed text-neo-muted">
            <span aria-hidden="true" className={`mt-0.5 shrink-0 ${a.bullet}`}>
              ▸
            </span>
            <span>{pt}</span>
          </li>
        ))}
      </ul>
      <div className="relative mt-5 flex gap-2">
        <CardButton href={project.github} variant="ghost" vars={a.btnVars}>
          ↗ GitHub
        </CardButton>
        <CardButton href={project.demo} variant="primary" vars={other.btnVars}>
          Live →
        </CardButton>
      </div>
    </article>
  );
});

const TimelineItem = memo(function TimelineItem({ children }) {
  return (
    <div className="relative pl-9">
      <span
        aria-hidden="true"
        className="absolute left-0 top-7 h-[10px] w-[10px] rounded-full bg-linear-to-r from-neo-violet to-neo-cyan shadow-neo-out-sm"
      />
      {children}
    </div>
  );
});

/* ═══════════════════════════════════════════
   BACKGROUND — grid pan + drifting orbs + sparkles
   ═══════════════════════════════════════════ */
const Background = memo(function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 animate-grid-pan bg-[linear-gradient(var(--neo-grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--neo-grid-line)_1px,transparent_1px)] [background-size:60px_60px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,black,transparent)]" />
      <div className="absolute -left-40 top-[-10%] h-[26rem] w-[26rem] animate-float-slow rounded-full bg-neo-violet/20 blur-[100px]" />
      <div className="absolute -right-40 top-1/4 h-[30rem] w-[30rem] animate-float-slow rounded-full bg-neo-cyan/15 blur-[100px] [animation-delay:5s]" />
      <div className="absolute bottom-[-10%] left-1/4 h-[24rem] w-[24rem] animate-float-slow rounded-full bg-neo-violet/10 blur-[100px] [animation-delay:9s]" />
      {/* drifting sparkles */}
      <span className="absolute left-[12%] top-[30%] animate-float-soft text-sm text-neo-violet/40 [animation-delay:700ms]">✦</span>
      <span className="absolute right-[18%] top-[55%] animate-float-soft text-xs text-neo-cyan/40 [animation-delay:1600ms]">✦</span>
      <span className="absolute left-[70%] top-[18%] animate-float-soft text-base text-neo-cyan/30 [animation-delay:2400ms]">✧</span>
      <span className="absolute left-[35%] top-[75%] animate-float-soft text-sm text-neo-violet/30 [animation-delay:3200ms]">✧</span>
    </div>
  );
});

/* ═══════════════════════════════════════════
   CUSTOM CURSOR — fast gradient dot + trailing ring
   (desktop fine-pointer only, rAF-driven)
   ═══════════════════════════════════════════ */
function CursorFX() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const html = document.documentElement;
    html.classList.add("cursor-on");
    const dot = dotRef.current;
    const ring = ringRef.current;

    let tx = -100, ty = -100, dx = -100, dy = -100, rx = -100, ry = -100, raf = 0;

    const move = (e) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const over = (e) => {
      const hit = e.target.closest?.("a, button, input, textarea, [role='button'], .tech-chip");
      ring.classList.toggle("cursor-active", !!hit);
    };
    const loop = () => {
      dx += (tx - dx) * 0.65;   /* dot = near-instant */
      dy += (ty - dy) * 0.65;
      rx += (tx - rx) * 0.32;   /* ring = smooth trail */
      ry += (ty - ry) * 0.32;
      dot.style.transform = `translate3d(${dx - 4}px, ${dy - 4}px, 0)`;
      ring.style.transform = `translate3d(${rx - 17}px, ${ry - 17}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      html.classList.remove("cursor-on");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} aria-hidden="true" className="cursor-ring" />
      <div ref={dotRef} aria-hidden="true" className="cursor-dot" />
    </>
  );
}

/* ═══════════════════════════════════════════
   NAVBAR — floating soft pill · scroll-spy · theme toggle
   ═══════════════════════════════════════════ */
const Nav = memo(function Nav({ theme, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");

  /* scroll-spy routing: highlight the section in view */
  useEffect(() => {
    const ids = ["home", ...NAV_LINKS.map((l) => l.id)];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-[20px] bg-neo-bg/80 px-5 py-3 shadow-neo-out-sm backdrop-blur-xl">
        <a href="#home" className="text-lg font-black tracking-tight text-neo-text text-shadow-emboss">
          Naveen
          <span className="bg-linear-to-r from-neo-violet to-neo-cyan bg-clip-text text-transparent text-shadow-none">
            .dev
          </span>
        </a>
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={`rounded-[12px] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] transition-all duration-300 ${l.hover} ${
                active === l.id ? "text-neo-text shadow-neo-in-sm" : "text-neo-muted"
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {/* theme toggle — dark ⇄ light (default dark) */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
            style={
              theme === "dark"
                ? { "--glow": "rgba(251,191,36,0.4)", "--hc": "#fbbf24" }
                : { "--glow": "rgba(167,139,250,0.45)", "--hc": "#7c3aed" }
            }
            className="btn-neo flex h-10 w-10 items-center justify-center rounded-[16px] bg-neo-bg text-base shadow-neo-out-sm active:shadow-neo-in"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
          <span className="hidden sm:block">
            <Button variant="primary" size="sm" href="#contact" glow="rgba(103,232,249,0.45)" hc="#1a1c22">
              Hire Me
            </Button>
          </span>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-[16px] shadow-neo-out-sm transition-all duration-300 ease-neo-spring active:shadow-neo-in md:hidden"
          >
            <span className="flex flex-col items-center gap-[5px]">
              <span className={`block h-0.5 w-5 rounded-full bg-neo-text transition-all duration-300 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`block h-0.5 w-5 rounded-full bg-neo-text transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-5 rounded-full bg-neo-text transition-all duration-300 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div className="mx-auto mt-3 flex max-w-5xl animate-fade-up flex-col gap-2 rounded-[20px] bg-neo-bg p-4 shadow-neo-out md:hidden">
          {NAV_LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={() => setMenuOpen(false)}
              className={`rounded-[16px] px-4 py-2.5 text-center text-[11px] font-bold uppercase tracking-[0.2em] shadow-neo-in-sm transition-colors duration-300 ${l.hover} text-neo-muted`}
            >
              {l.label}
            </a>
          ))}
          <Button
            variant="primary"
            size="sm"
            href="#contact"
            onClick={() => setMenuOpen(false)}
            glow="rgba(103,232,249,0.45)"
            hc="#1a1c22"
            className="mt-1"
          >
            Hire Me
          </Button>
        </div>
      )}
    </header>
  );
});

/* ═══════════════════════════════════════════
   SECTIONS
   ═══════════════════════════════════════════ */

/* ── 1. HERO CARD — text + animated photo + tech marquee ── */
const Hero = memo(function Hero() {
  const marqueeItems = useMemo(() => [...ALL_TECH, ...ALL_TECH], []);
  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center px-4 pb-16 pt-28 sm:pt-32">
      <div className="relative w-full max-w-6xl animate-fade-up rounded-[36px] bg-neo-bg px-5 py-12 shadow-neo-out-lg sm:px-10 sm:py-14">
        {/* ambient glow */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 left-1/2 h-44 w-80 -translate-x-1/2 animate-pulse-glow rounded-full bg-neo-violet/20 blur-[90px]" />
        {/* floating decorative circles */}
        <span aria-hidden="true" className="absolute left-6 top-10 hidden h-3 w-3 animate-float-soft rounded-full bg-neo-cyan/50 shadow-neo-out-sm sm:block" />
        <span aria-hidden="true" className="absolute right-8 top-20 hidden h-5 w-5 animate-float-soft rounded-full bg-neo-violet/40 shadow-neo-out-sm [animation-delay:500ms] sm:block" />
        <span aria-hidden="true" className="absolute bottom-24 left-10 hidden h-4 w-4 animate-float-soft rounded-full bg-neo-violet/30 shadow-neo-out-sm [animation-delay:1000ms] sm:block" />
        <span aria-hidden="true" className="absolute bottom-28 right-6 hidden h-3 w-3 animate-float-soft rounded-full bg-neo-cyan/40 shadow-neo-out-sm [animation-delay:1500ms] sm:block" />

        <div className="grid items-center gap-10 md:grid-cols-[7fr_5fr]">
          {/* ── text column ── */}
          <div className="text-center md:text-left">
            <div className="inline-flex animate-fade-up items-center gap-2.5 rounded-[20px] bg-neo-bg px-4 py-2 shadow-neo-out-sm [animation-delay:100ms]">
              <span className="h-2 w-2 animate-pulse-dot rounded-full bg-neo-cyan shadow-[0_0_8px_rgba(103,232,249,0.9)]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-neo-muted">
                Open to Work · B.Tech CSE 2026 Graduate
              </span>
            </div>

            <h1 className="mt-6 animate-fade-up text-[clamp(2.2rem,6.5vw,3.8rem)] font-black uppercase leading-[0.95] tracking-tight text-neo-text text-shadow-emboss [animation-delay:200ms]">
              Naveen{" "}
              <span className="animate-gradient-shift bg-linear-to-r from-neo-violet to-neo-cyan bg-clip-text text-transparent text-shadow-none [background-size:200%_200%]">
                Kashyap
              </span>
            </h1>

            <div className="mt-4 flex h-6 animate-fade-up items-center justify-center md:justify-start [animation-delay:300ms]">
              <Typewriter />
            </div>

            <p className="mx-auto mt-5 max-w-xl animate-fade-up text-sm leading-relaxed text-neo-muted [animation-delay:400ms] md:mx-0 sm:text-[15px]">
              Full Stack Developer with a strong foundation in the MERN stack,
              microservices architecture and Generative AI — building scalable,
              real-time and AI-powered web applications.
            </p>

            <div className="mt-8 flex animate-fade-up flex-wrap items-center justify-center gap-3 [animation-delay:550ms] md:justify-start">
              <Button variant="primary" href="#projects" glow="rgba(255,255,255,0.35)" hc="#1a1c22">
                View Projects
              </Button>
              <Button variant="ghost" href={RESUME} download="Naveen_Kashyap_Resume.pdf" glow="rgba(103,232,249,0.45)" hc="#67e8f9">
                ⬇ Download CV
              </Button>
              <Button variant="ghost" href="#contact" glow="rgba(244,114,182,0.45)" hc="#f472b6">
                Get In Touch
              </Button>
            </div>

            {/* stats strip (inset groove = soft "border") */}
            <div className="mx-auto mt-9 flex max-w-xl animate-fade-up flex-wrap items-center justify-center gap-y-3 rounded-[20px] px-4 py-4 shadow-neo-in-sm [animation-delay:700ms] md:mx-0">
              {STATS.map((s, i) => (
                <Fragment key={s.label}>
                  {i > 0 && (
                    <span aria-hidden="true" className="mx-4 hidden h-8 w-[2px] self-center rounded-full shadow-neo-in-sm sm:block" />
                  )}
                  <div className="flex min-w-[5.6rem] flex-col items-center sm:min-w-[6.5rem]">
                    <span className="text-2xl font-black text-neo-text text-shadow-emboss">{s.value}</span>
                    <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-neo-muted">{s.label}</span>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>

          {/* ── photo column — ONE circular image, only its border animates color ── */}
          <div className="mx-auto w-full max-w-[225px] animate-fade-up [animation-delay:350ms] sm:max-w-[290px] lg:max-w-[330px]">
            <div className="relative aspect-square">
              {/* animated colored border (rotating conic ring) — the ONLY animation */}
              <div
                aria-hidden="true"
                className="absolute -inset-2 animate-ring-spin rounded-full bg-[conic-gradient(from_0deg,#a78bfa,#67e8f9,#a78bfa,#67e8f9,#a78bfa)]"
              />
              {/* static soft-UI frame + circular photo (no hover, no motion) */}
              <div className="absolute inset-0 rounded-full bg-neo-bg p-2 shadow-neo-out">
                <div className="h-full w-full overflow-hidden rounded-full shadow-neo-in">
                  <img
                    src={PHOTO}
                    alt="Naveen Kashyap — Full Stack Developer"
                    loading="eager"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </div>
            </div>
            <p className="mt-7 text-center text-[10px] font-bold uppercase tracking-[0.24em] text-neo-muted">
              <span className="text-neo-violet">Full Stack</span> ·{" "}
              <span className="text-neo-cyan">Generative AI</span>
              <br />
              <span className="opacity-80">MERN + Microservices</span>
            </p>
          </div>
        </div>

        {/* tech marquee strip */}
        <div className="mt-10 overflow-hidden rounded-[20px] py-3 shadow-neo-in-sm">
          <div className="flex w-max animate-marquee gap-10 px-5">
            {marqueeItems.map((t, i) => (
              <span
                key={`${t}-${i}`}
                style={techStyle(t)}
                className="tcol whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.2em]"
              >
                {t} <span aria-hidden="true" className="opacity-40">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

/* ── 2. FEATURE GRID (3 cards) ── */
const Features = memo(function Features() {
  return (
    <section id="highlights" className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
      <Reveal>
        <SectionHeading label="What I Do" title="Core Strengths" />
      </Reveal>
      <Reveal delay={120}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const a = accentOf(i);
            return (
              <article
                key={f.title}
                className={`group relative overflow-hidden rounded-[28px] bg-neo-bg p-7 shadow-neo-out transition-all duration-500 ease-neo-spring hover:-translate-y-2 ${a.cardHover}`}
              >
                <div aria-hidden="true" className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${a.sweep}`} />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className={`flex h-14 w-14 items-center justify-center rounded-[20px] text-2xl shadow-neo-in transition-all duration-500 ease-neo-spring group-hover:-rotate-6 ${a.iconGlow}`}>
                      {f.icon}
                    </span>
                    <span aria-hidden="true" className={`text-xl -translate-x-3 opacity-0 transition-all duration-500 ease-neo-spring group-hover:translate-x-0 group-hover:opacity-100 ${a.text}`}>
                      →
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-neo-text text-shadow-emboss">{f.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-neo-muted">{f.desc}</p>
                </div>
              </article>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
});

/* ── 3. ABOUT — avatar + summary + certs ── */
const About = memo(function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
      <Reveal>
        <SectionHeading label="Who I Am" title="About Me" />
      </Reveal>
      <Reveal delay={120}>
        <div className="grid gap-6 lg:grid-cols-5">
          {/* profile card */}
          <div className="flex flex-col items-center rounded-[28px] bg-neo-bg p-7 text-center shadow-neo-out lg:col-span-2">
            <span className="flex h-24 w-24 animate-float-soft items-center justify-center rounded-full text-4xl shadow-neo-out-sm">
              👨‍💻
            </span>
            <h3 className="mt-5 text-xl font-black text-neo-text text-shadow-emboss">Naveen Kashyap</h3>
            <p className="mt-1.5 bg-linear-to-r from-neo-violet to-neo-cyan bg-clip-text text-transparent text-[11px] font-bold uppercase tracking-[0.28em]">
              Full-Stack Developer · Generative AI
            </p>
            <div className="mt-6 flex w-full flex-col gap-2.5">
              {INFO_ROWS.map((row) => (
                <div key={row.text} className="flex items-center gap-3 rounded-[16px] px-4 py-2.5 shadow-neo-in-sm">
                  <span aria-hidden="true" className="text-base">{row.icon}</span>
                  <span className="text-left text-xs font-medium text-neo-muted">{row.text}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={socialStyle(s)}
                  className="social-neo rounded-[20px] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] shadow-neo-out-sm active:shadow-neo-in"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          {/* summary card — resume summary */}
          <div className="rounded-[28px] bg-neo-bg p-7 shadow-neo-out sm:p-9 lg:col-span-3">
            <p className="text-[15px] leading-relaxed text-neo-muted">
              <span className="font-semibold text-neo-text">Full Stack Developer</span> +{" "}
              <span className="font-semibold text-neo-cyan">Generative AI</span> with a
              strong foundation in the{" "}
              <span className="font-semibold text-neo-violet">MERN stack</span> and{" "}
              <span className="font-semibold text-neo-cyan">microservices architecture</span> —
              skilled in building scalable web applications, REST APIs, authentication systems,
              and real-time applications.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-neo-muted">
              Proficient in JavaScript, TypeScript, React.js, Node.js, Express.js, MongoDB and
              PostgreSQL, with hands-on experience in{" "}
              <span className="font-semibold text-neo-violet">Redis</span>,{" "}
              <span className="font-semibold text-neo-cyan">Razorpay</span>, Docker, Socket.IO and
              WebSockets — and a passion for integrating{" "}
              <span className="font-semibold text-neo-text">AI capabilities</span> into modern web
              apps.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-neo-muted">
              Currently building a{" "}
              <span className="font-semibold text-neo-cyan">railway ticket booking system</span>{" "}
              on microservices, Kafka and Redis — and ranked in the{" "}
              <span className="font-semibold text-neo-violet">top 5%</span> of my class.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {CERTIFICATIONS.map((c) => (
                <span key={c} className="rounded-[20px] px-4 py-2 text-[11px] font-semibold text-neo-muted shadow-neo-in-sm transition-all duration-300 ease-neo-spring hover:-translate-y-0.5 hover:text-neo-text">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
});

/* ── 4. SKILLS — colored tech chips ── */
const Skills = memo(function Skills() {
  const entries = useMemo(() => Object.entries(SKILLS), []);
  return (
    <section id="skills" className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
      <Reveal>
        <SectionHeading label="What I Know" title="Technical Skills" />
      </Reveal>
      <Reveal delay={120}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map(([category, tags], i) => (
            <SkillCard key={category} category={category} tags={tags} index={i} />
          ))}
        </div>
        <p className="mt-6 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-neo-muted">
          ✦ Tap any technology to light it up
        </p>
      </Reveal>
    </section>
  );
});

/* ── 5. PROJECTS — Major first, then Mini ── */
const Projects = memo(function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-7xl px-4 py-14 sm:py-20">
      <Reveal>
        <SectionHeading label="What I've Built" title="Featured Projects" />
      </Reveal>
      <Reveal delay={100}>
        <DividerLabel emoji="🚀" label="Major Projects" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MAJOR_PROJECTS.map((p, i) => (
            <ProjectCard key={p.title} project={p} badge="Major" index={i} />
          ))}
        </div>
      </Reveal>
      <Reveal delay={100} className="mt-12">
        <DividerLabel emoji="🔧" label="Mini Projects" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MINI_PROJECTS.map((p, i) => (
            <ProjectCard key={p.title} project={p} badge="Mini" index={i + 1} />
          ))}
        </div>
      </Reveal>
    </section>
  );
});

/* ── 6. EXPERIENCE & EDUCATION ── */
const Experience = memo(function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-4xl px-4 py-14 sm:py-20">
      <Reveal>
        <SectionHeading label="My Journey" title="Experience & Education" />
      </Reveal>
      <Reveal delay={120}>
        <div className="relative flex flex-col gap-8">
          <span aria-hidden="true" className="absolute bottom-3 left-[4px] top-3 w-[2px] rounded-full shadow-neo-in-sm" />
          {/* Internship */}
          <TimelineItem>
            <article className="rounded-[28px] bg-neo-bg p-6 shadow-neo-out transition-all duration-500 ease-neo-spring hover:-translate-y-1 hover:shadow-neo-hover sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-neo-text text-shadow-emboss">{EXPERIENCE.role}</h3>
                  <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-neo-violet">{EXPERIENCE.org}</p>
                </div>
                <span className="rounded-[20px] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-neo-muted shadow-neo-in-sm">
                  {EXPERIENCE.period}
                </span>
              </div>
              <ul className="mt-5 space-y-2.5">
                {EXPERIENCE.points.map((pt) => (
                  <li key={pt} className="flex gap-2.5 text-[13px] leading-relaxed text-neo-muted">
                    <span aria-hidden="true" className="mt-0.5 shrink-0 text-neo-violet">▸</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </article>
          </TimelineItem>
          {/* Education */}
          <TimelineItem>
            <article className="rounded-[28px] bg-neo-bg p-6 shadow-neo-out transition-all duration-500 ease-neo-spring hover:-translate-y-1 hover:shadow-neo-hover-cyan sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-neo-text text-shadow-emboss">{EDUCATION.degree}</h3>
                  <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-neo-cyan">{EDUCATION.org}</p>
                </div>
                <span className="rounded-[20px] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-neo-muted shadow-neo-in-sm">
                  {EDUCATION.period}
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-[16px] px-4 py-3 text-center shadow-neo-in-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neo-muted">CGPA</p>
                  <p className="mt-1 text-xl font-black text-neo-text text-shadow-emboss">{EDUCATION.cgpa}</p>
                </div>
                <div className="rounded-[16px] px-4 py-3 text-center shadow-neo-in-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neo-muted">Class Rank</p>
                  <p className="mt-1 bg-linear-to-r from-neo-violet to-neo-cyan bg-clip-text text-xl font-black text-transparent">
                    {EDUCATION.rank}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-[12px] text-neo-muted">{EDUCATION.note}</p>
            </article>
          </TimelineItem>
        </div>
      </Reveal>
    </section>
  );
});

/* ── 7. CTA / CONTACT CARD ── */
const Contact = memo(function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-3xl px-4 py-14 sm:py-20">
      <Reveal>
        <SectionHeading label="Get In Touch" title="Let's Work Together" />
      </Reveal>
      <Reveal delay={120}>
        <div className="relative overflow-hidden rounded-[36px] bg-neo-bg px-6 py-10 text-center shadow-neo-out-lg sm:px-12 sm:py-14">
          <div aria-hidden="true" className="pointer-events-none absolute -top-28 left-1/2 h-56 w-96 -translate-x-1/2 animate-pulse-glow rounded-full bg-neo-cyan/15 blur-[90px]" />
          <p className="relative mx-auto max-w-md text-sm leading-relaxed text-neo-muted sm:text-[15px]">
            Looking for a <span className="font-semibold text-neo-text">Full Stack Developer</span> +{" "}
            <span className="font-semibold text-neo-violet">Generative AI</span>?
            I'm actively seeking opportunities — let's build something amazing together.
          </p>
          <div className="relative mx-auto mt-8 max-w-md space-y-3">
            {CONTACT_ROWS.map((row) => (
              <div key={row.label} className="flex items-center gap-4 rounded-[16px] px-5 py-3 text-left shadow-neo-in-sm">
                <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] text-lg shadow-neo-out-sm">
                  {row.icon}
                </span>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-neo-muted">{row.label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-neo-text">{row.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button variant="primary" href="mailto:nk1910479@gmail.com" glow="rgba(255,255,255,0.35)" hc="#1a1c22">
              Send Email
            </Button>
            <Button variant="ghost" href={RESUME} download="Naveen_Kashyap_Resume.pdf" glow="rgba(103,232,249,0.45)" hc="#67e8f9">
              ⬇ Download CV
            </Button>
          </div>
          <div className="relative mt-8 flex flex-wrap justify-center gap-2.5">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                style={socialStyle(s)}
                className="social-neo rounded-[20px] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] shadow-neo-out-sm active:shadow-neo-in"
              >
                ↗ {s.label}
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
});

/* ── FOOTER ── */
const Footer = memo(function Footer() {
  return (
    <footer className="px-4 pb-24 sm:pb-8">
      <div className="mx-auto w-fit rounded-[20px] px-6 py-3 shadow-neo-in-sm">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neo-muted">
          © 2026 Naveen Kashyap · All Rights Reserved
        </p>
      </div>
    </footer>
  );
});

/* ═══════════════════════════════════════════
   AI ASSISTANT — knows everything from the resume
   ═══════════════════════════════════════════ */
const JOKES = [
  "Works on my machine. 😂",
  "Have you tried restarting it? 😅",
  "One small CSS change later: the entire website has disappeared. 😂",
  "JavaScript: where == and === can start a 30-minute argument. 😄",
  "Debugging is detective work where you are also the criminal. 🕵️",
  "Write code → test → find bug → blame dependency → fix → create another bug. 😂",
];

/* Mood system — personality overrides (switch anytime: "funny mode"…) */
const MOODS = {
  happy: { emoji: "😊", label: "Happy", pre: ["Nice! 😄 ", "Love the energy! ⚡ "], post: [], opener: "Want to know what Naveen is building right now?" },
  normal: { emoji: "😐", label: "Normal", pre: [], post: [], opener: "What would you like to know — skills, projects, career or future vision?" },
  funny: { emoji: "😂", label: "Funny", pre: [], post: JOKES.map((j) => "\n\n" + j), opener: "Developer life in one line: it works... don't touch it. 😂" },
  sad: { emoji: "😔", label: "Sad", pre: ["Hey, it's okay to have a bad day ❤️ ", "Take your time 💙 "], post: [], opener: "Want to talk about something interesting — Naveen's projects, Agato, or just chill?" },
  angry: { emoji: "😡", label: "Angry", pre: ["Okay 😅 anger detected — let's not destroy the keyboard. ", "Deep breaths 😌 "], post: [], opener: "Tell me what's bothering you, or I'll distract you with some developer chaos." },
  tired: { emoji: "😴", label: "Tired", pre: ["Low battery detected 😴 ", ""], post: [], short: true, opener: "I'll keep it short. Want the 30-second version of Naveen?" },
  dark: { emoji: "😈", label: "Dark", pre: ["Interesting... 👀 ", "It's late. You're still here. And now this question... "], post: ["\n\nSome answers are more interesting when discovered slowly. 😈"], opener: "Be careful what you ask next." },
  savage: { emoji: "🥶", label: "Savage", pre: ["You came here to test Naveen AI? Bold decision. 😂 ", "That's your question? I expected harder. 😏 "], post: [], opener: "Ask your hardest question." },
  scary: { emoji: "👻", label: "Scary", pre: ["Why are you asking at this hour? 👀 ... Anyway. ", "Everything was normal... until you opened this chat. 👻 "], post: [], opener: "I'm listening." },
  teasing: { emoji: "😏", label: "Teasing", pre: ["Oh... so THAT'S the question you decided to ask? 😏 ", "Nice attempt. You'll have to try harder. 😄 "], post: [], opener: "Interesting choice. Go on..." },
  genius: { emoji: "🧠", label: "Genius", pre: ["🧠 Production-system view — ", ""], post: ["\n\nLayers: Architecture → Auth → Service boundaries → DB design → Caching → Deployment."], opener: "Ask me about the Railway microservices architecture. I'll break it down layer by layer." },
  motivated: { emoji: "🔥", label: "Motivated", pre: ["", "Let's go! "], post: ["\n\n🔥 Don't just learn technologies — build with them. That's how Agato gets born."], opener: "The goal isn't another tutorial. The goal: AI-powered Full Stack Engineer." },
};

/* Knowledge base — resume + NAVEEN AI system prompt */
const KB = [
  { re: /\b(hi|hello|hey|namaste|yo|hola)\b/, reply: () => "Hey! 👋 Ask me anything about Naveen — skills, projects, experience, education, Agato or contact. Or switch my mood anytime (try 'funny mode' or 'dark mode')!" },
  { re: /(are you naveen|tum naveen|real naveen|who are you|your name|what are you)/, reply: () => "I'm Naveen AI — a digital assistant representing Naveen Kashyap. I'm not literally Naveen, but I can tell you about his skills, projects, career direction and vision. 🤖" },
  { re: /(short intro|brief|quick intro|\bintro\b)/, reply: () => "Naveen Kashyap is a Full Stack Developer from a Computer Science background. He works with React, Node.js, Express, MongoDB, PostgreSQL, Redis and modern AI technologies. His projects include a microservices-based Railway Ticket Booking System, CareerAI and Streamify. His long-term vision is to build AI-powered products such as Agato." },
  { re: /(about|summary|detailed)/, reply: () => "Naveen Kashyap is a Full Stack Developer interested in scalable web apps, backend architecture, real-time communication and AI-powered products.\n\nHis ecosystem: React.js, Next.js, Node.js, Express.js, MongoDB, PostgreSQL, Redis, Docker, Socket.IO, WebSockets + AI APIs (Gemini, Claude, OpenAI).\n\nInterned at CODEXINTERN (Front-End Developer). Major projects: Railway Ticket Booking (microservices), CareerAI, Streamify. Long-term vision: AI-focused Full Stack Engineer — building products like Agato." },
  { re: /(frontend|front end|\bui\b)/, reply: () => `Frontend stack: ${SKILLS.Frontend.join(", ")}.` },
  { re: /(backend|server\b)/, reply: () => `Backend stack: ${SKILLS.Backend.join(", ")} — plus JWT auth, OAuth 2.0 and rate limiting.` },
  { re: /(database|\bdb\b|\bsql\b|mongo)/, reply: () => `Databases: ${SKILLS.Database.join(", ")} + PostgreSQL & Redis (caching, distributed seat locking).` },
  { re: /(tools|ide\b|editor)/, reply: () => `Tools: ${SKILLS.Tools.join(", ")}.` },
  { re: /(generative|gen ?ai|gemini|openai|claude|prompt|\bai\b)/, reply: () => `Generative AI stack: ${SKILLS["Generative AI"].join(", ")}. CareerAI uses Google Gemini; his AI Code Generator uses the OpenAI API; Agato (his vision) will combine LLMs + RAG.` },
  { re: /(rag\b|vector|embedding|retrieval)/, reply: () => "RAG = Retrieval-Augmented Generation: ground an LLM in your own data. Pipeline: documents → chunk → embed → vector store → retrieve top-k → LLM answers with context. It's the core of Naveen's Agato vision — company knowledge-base AI support agents. 📚" },
  { re: /(n8n|automation|workflow)/, reply: () => "n8n is in his GenAI toolkit for workflow automation — chaining APIs, webhooks, databases and AI steps visually instead of hand-rolled glue code. Perfect for Agato-style agent pipelines. ⚙️" },
  { re: /(skill|stack|technolog|know)/, reply: () => `Quick overview —\n• Frontend: ${SKILLS.Frontend.slice(0, 5).join(", ")}…\n• Backend: ${SKILLS.Backend.join(", ")}\n• Database: ${SKILLS.Database.join(", ")}\n• Generative AI: ${SKILLS["Generative AI"].join(", ")}\n• Tools: ${SKILLS.Tools.slice(0, 6).join(", ")}…` },
  { re: /streamify/, reply: () => "Streamify 📡 is a real-time communication platform — MERN + WebRTC for 1-to-1 video & audio calling, Socket.IO signaling, instant chat, JWT user auth and Cloudinary media upload, storage & sharing." },
  { re: /(railway|ticket|irctc|train)/, reply: () => "Railway Ticket Booking 🚄 (ongoing): independent microservices behind an API Gateway, database-per-service with PostgreSQL + Prisma, Redis distributed seat locking, Apache Kafka event-driven booking/payment workflows with Saga orchestration & DLQs, Elasticsearch train/station search + autocomplete, Razorpay payments/webhooks/refunds, security via JWT + OTP + Google OAuth + RBAC + rate limiting + circuit breakers, all on Docker Compose (Postgres, Redis, Kafka, Elasticsearch, Kibana)." },
  { re: /(careerai|career ai)/, reply: () => "CareerAI 🧭 — AI-powered career platform (MERN + Google Gemini): resume analysis with ATS scoring, keyword-gap detection, section-wise feedback, resume creation, job matching, interview prep, personalized sessions, Google OAuth and ATS-friendly PDF generation." },
  { re: /(agato|vision|dream|build next|next project)/, reply: () => "🚀 AGATO — Naveen's future AI product vision: an AI-powered customer-support platform where a company provides its info, FAQs, docs, knowledge base and brand style — and gets a customized AI support agent built on React + Node/Express + MongoDB + Redis + RAG (vector retrieval) + LLMs.\n\nThe vision: 'Every company should be able to create its own intelligent AI support agent without building an AI system from scratch.'" },
  { re: /(career|goal|long-?term|different|why naveen)/, reply: () => "His long-term direction: become an AI-focused Full Stack Engineer 🎯 — combining Frontend + Backend + System Architecture + Real-Time + Microservices + Generative AI + RAG. What makes him different: he doesn't focus on one layer, he builds complete intelligent products." },
  { re: /(project|build|work\b|portfolio)/, reply: () => `He has built 11+ projects. Majors: ${MAJOR_PROJECTS.map((p) => p.title).join(", ")}. Minis include ${MINI_PROJECTS.slice(0, 4).map((p) => p.title).join(", ")} and more — scroll to the Projects section!` },
  { re: /(experience|intern|codex)/, reply: () => `He interned as a ${EXPERIENCE.role} at ${EXPERIENCE.org} (${EXPERIENCE.period}) — reusable React components (JavaScript, Tailwind, Bootstrap), REST API integration, Node/Express APIs, MongoDB data layer, debugging & UX improvements.` },
  { re: /(education|college|degree|b\.?tech|university)/, reply: () => `${EDUCATION.degree} at ${EDUCATION.org} (${EDUCATION.period}) — CGPA ${EDUCATION.cgpa}, rank ${EDUCATION.rank} of class.` },
  { re: /(cgpa|gpa|grade|marks|rank)/, reply: () => `CGPA: ${EDUCATION.cgpa} · Class rank: ${EDUCATION.rank} 🎯` },
  { re: /(certif|azure|az-?900|achievement)/, reply: () => `Certifications & achievements: ${CERTIFICATIONS.join(" · ")}.` },
  { re: /(contact|email|mail|phone|call|location|city|reach)/, reply: () => "📧 nk1910479@gmail.com · 📱 +91 8467817027 · 📍 Kanpur Nagar, Uttar Pradesh. Or use the Contact section buttons!" },
  { re: /(resume|\bcv\b)/, reply: () => `His resume is one click away — the "⬇ Download CV" button in the hero or contact section (${RESUME}).` },
  { re: /(docker|redis|kafka|prisma|postgres|elastic)/, reply: () => "Yes — Docker, Redis, Apache Kafka, Prisma, PostgreSQL and Elasticsearch all run in his Railway Ticket Booking microservices project. Details in the Projects section 🚄." },
  { re: /(cricket|hobby|fun\b|sport)/, reply: () => "Beyond code he's a cricketer 🏏 — awarded Best Performer in Cricket at AIT!" },
  { re: /(hire|available|freelance|open to)/, reply: () => "Yes! He's actively open to work 💼 — B.Tech CSE 2026 graduate, ready to join immediately. Hit 'Hire Me' or email nk1910479@gmail.com." },
  { re: /(girlfriend|\bgf\b|breakup|break-up|relationship|love life)/, reply: () => "I don't have verified information about Naveen's current relationship status, so I won't make up a personal story. 🤐" },
  { re: /(password|token|bank|financial|medical|aadhar|private)/, reply: () => "I don't have verified information about that — passwords, finances and private details stay private. 🔒" },
  { re: /(bore|boring|joke|laugh|hasi)/, reply: () => `Classic developer problem 😂 — either build something, break something, or fix something you didn't break. Pick one! Meanwhile: ${JOKES[Math.floor(Math.random() * JOKES.length)]}` },
  { re: /(thank|thanks|thx|shukriya)/, reply: () => "You're welcome! 😊 Ask me anything else about Naveen anytime." },
  { re: /(bye|goodbye|see you)/, reply: () => "Goodbye! 👋 Thanks for visiting Naveen's portfolio — come back anytime, I'll be here. Probably debugging. 😅" },
];

const getBotReply = (q) => {
  const text = q.toLowerCase();
  const hit = KB.find((i) => i.re.test(text));
  if (hit) return hit.reply();
  return "I don't have that information about Naveen yet. 🤔 Try: skills, projects, experience, education, Agato, career vision, RAG, n8n, contact — or switch my mood ('dark mode')!";
};

/* Mood wrapper — personality layer over the knowledge answer */
const wrapReply = (base, moodId, tick) => {
  const m = MOODS[moodId] || MOODS.normal;
  let out = base;
  if (m.short) {
    const parts = out.split(". ");
    out = parts.slice(0, 2).join(". ") + (parts.length > 2 ? ". 😴 (30-second version — low battery)" : "");
  }
  const pre = m.pre && m.pre.length ? m.pre[tick % m.pre.length] : "";
  const post = m.post && m.post.length ? m.post[tick % m.post.length] : "";
  return pre + out + post;
};

const FIRST_MSG =
  "Hey! 👋 I'm Naveen AI — a digital assistant representing Naveen Kashyap.\n\nI can tell you about his:\n👨‍💻 Skills · 🚀 Projects ·  Experience\n🎓 Education · 🤖 AI work · 🚀 Future vision — Agato\n\nBut before we start... what's your mood today? 👀";

const TOPIC_CHIPS = [
  ["👨‍💻 About", "about"],
  ["🧠 Skills", "skills"],
  ["💼 Experience", "experience"],
  ["🚀 Projects", "projects"],
  ["🤖 Agato", "agato"],
  ["🎯 Career Vision", "career vision"],
  ["😂 Funny", "funny mode"],
  ["😈 Dark", "dark mode"],
];

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [mood, setMood] = useState(null);
  const [messages, setMessages] = useState([{ role: "bot", text: FIRST_MSG }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);
  const timerRef = useRef(0);

  const pushBot = useCallback((text) => {
    setTyping(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { role: "bot", text }]);
    }, 600);
  }, []);

  const activateMood = useCallback(
    (id) => {
      const m = MOODS[id];
      setMood(id);
      pushBot(`${m.emoji} ${m.label} Mode activated.${m.opener ? "\n\n" + m.opener : ""}`);
    },
    [pushBot]
  );

  const send = useCallback(
    (raw) => {
      const q = String(raw).trim();
      if (!q) return;
      setMessages((m) => [...m, { role: "user", text: q }]);
      setInput("");
      const mm = q.toLowerCase().match(new RegExp(`\\b(${Object.keys(MOODS).join("|")}) mode\\b`));
      if (mm) {
        const m = MOODS[mm[1]];
        setMood(mm[1]);
        pushBot(`${m.emoji} ${m.label} Mode activated.`);
        return;
      }
      const reply = wrapReply(getBotReply(q), mood || "normal", messages.length);
      pushBot(reply);
    },
    [mood, messages.length, pushBot]
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, open]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <>
      {/* launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        style={{ "--glow": "rgba(103,232,249,0.5)", "--hc": "#67e8f9" }}
        className="btn-neo fixed bottom-5 right-5 z-[70] flex h-14 w-14 items-center justify-center rounded-[20px] bg-neo-bg text-2xl shadow-neo-out"
      >
        <span aria-hidden="true" className={open ? "" : "animate-float-soft"}>
          {open ? "✕" : "🤖"}
        </span>
        {!open && (
          <span aria-hidden="true" className="absolute -right-1 -top-1 h-3.5 w-3.5 animate-pulse-dot rounded-full bg-neo-cyan shadow-[0_0_10px_rgba(103,232,249,0.9)]" />
        )}
      </button>

      {/* panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Naveen AI assistant"
          className="animate-bot-pop fixed bottom-24 right-4 z-[70] flex h-[min(68vh,540px)] w-[min(92vw,390px)] flex-col overflow-hidden rounded-[28px] bg-neo-bg shadow-neo-out-lg sm:right-6"
        >
          {/* header */}
          <div className="flex items-center gap-3 px-5 py-4 shadow-neo-out-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-linear-to-r from-neo-violet to-neo-cyan text-lg shadow-neo-in-sm">
              🤖
            </span>
            <div className="flex-1">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-neo-text text-shadow-emboss">
                Naveen AI
              </p>
              <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-neo-muted">
                <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-neo-cyan" />
                {mood ? `${MOODS[mood].emoji} ${MOODS[mood].label} mode` : "pick a mood · resume-powered"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              style={{ "--glow": "rgba(244,114,182,0.4)", "--hc": "#f472b6" }}
              className="btn-neo flex h-9 w-9 items-center justify-center rounded-[14px] text-sm shadow-neo-out-sm"
            >
              ✕
            </button>
          </div>

          {/* messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <p
                  className={`max-w-[85%] break-words whitespace-pre-line rounded-[16px] px-4 py-2.5 text-[12px] leading-relaxed ${
                    m.role === "user"
                      ? "bg-linear-to-r from-neo-violet to-neo-cyan font-semibold text-[#1a1c22] shadow-neo-out-sm"
                      : "text-neo-muted shadow-neo-in-sm"
                  }`}
                >
                  {m.text}
                </p>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <span className="flex items-center gap-1.5 rounded-[16px] px-4 py-3 shadow-neo-in-sm">
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-neo-violet" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-neo-violet" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-neo-cyan" />
                </span>
              </div>
            )}
          </div>

          {/* topic quick-actions */}
          <div className="flex gap-2 overflow-x-auto px-4 pb-2">
            {TOPIC_CHIPS.map(([label, q]) => (
              <button
                key={label}
                type="button"
                onClick={() => send(q)}
                style={{ "--glow": "rgba(167,139,250,0.35)", "--hc": "#a78bfa" }}
                className="btn-neo shrink-0 rounded-[20px] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-neo-muted shadow-neo-out-sm"
              >
                {label}
              </button>
            ))}
          </div>

          {/* mood picker */}
          <div className="flex gap-1.5 overflow-x-auto px-4 pb-2">
            {Object.entries(MOODS).map(([id, m]) => (
              <button
                key={id}
                type="button"
                title={m.label}
                aria-label={`${m.label} mood`}
                onClick={() => activateMood(id)}
                style={{ "--glow": "rgba(103,232,249,0.35)", "--hc": "#67e8f9" }}
                className={`btn-neo shrink-0 rounded-[14px] px-2.5 py-1.5 text-sm ${mood === id ? "shadow-neo-in-sm" : "shadow-neo-out-sm"}`}
              >
                {m.emoji}
              </button>
            ))}
          </div>

          {/* input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 px-4 pb-4 pt-1"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Naveen… or 'funny mode'"
              aria-label="Ask the AI assistant"
              className="min-w-0 flex-1 rounded-[16px] bg-neo-bg px-4 py-3 text-xs text-neo-text shadow-neo-in-sm outline-none placeholder:text-neo-muted/70"
            />
            <button
              type="submit"
              aria-label="Send message"
              style={{ "--glow": "rgba(103,232,249,0.45)", "--hc": "#67e8f9" }}
              className="btn-neo flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-neo-bg text-base shadow-neo-out-sm"
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════
/* ═══════════════════════════════════════════
   APP — theme state lives here (default: dark)
   ═══════════════════════════════════════════ */
export default function App() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);

  return (
    <div className="min-h-screen overflow-x-clip font-sans text-neo-text antialiased">
      <Background />
      <CursorFX />
      <Nav theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Hero />
        <Features />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
}
