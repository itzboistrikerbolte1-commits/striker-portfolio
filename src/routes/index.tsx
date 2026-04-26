import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Nav } from "@/components/cinematic/Nav";
import { CursorGlow } from "@/components/cinematic/CursorGlow";
import { Magnetic } from "@/components/cinematic/Magnetic";
import { SplitReveal } from "@/components/cinematic/SplitReveal";
import { TextScrub } from "@/components/cinematic/TextScrub";
import { HorizontalScroll } from "@/components/cinematic/HorizontalScroll";
import { ServiceHover } from "@/components/cinematic/ServiceHover";
import { StackEcosystem } from "@/components/cinematic/StackEcosystem";
import { Preloader } from "@/components/cinematic/Preloader";
import { AboutSection } from "@/components/cinematic/AboutSection";
import { WebsiteShowcase } from "@/components/cinematic/WebsiteShowcase";
import { useSmoothScrollProgress } from "@/hooks/useSmoothScrollProgress";
import { useActiveSection } from "@/hooks/useActiveSection";
import { scrollToId } from "@/lib/scrollTo";
import type { SceneMode } from "@/components/cinematic/SceneCanvas";
import sentinelImg from "@/assets/sentinel.png";
import atlasImg from "@/assets/atlas.png";
import lumenImg from "@/assets/lumen.png";
import orbitImg from "@/assets/orbit.png";
import nexusImg from "@/assets/nexus.png";
import datapulseImg from "@/assets/datapulse.png";

import flowsyncImg from "@/assets/flowsync.png";
import novapayImg from "@/assets/novapay.png";
import lumenLegalImg from "@/assets/lumen_legal.png";
import orbitVoiceImg from "@/assets/orbit_voice.png";
import auraScrollImg from "@/assets/aura_scroll.png";
import devsaasImg from "@/assets/devsaas.png";

const SceneCanvas = lazy(() =>
  import("@/components/cinematic/SceneCanvas").then((m) => ({ default: m.SceneCanvas })),
);

export const Route = createFileRoute("/")(({
  component: Index,
}));

const CHAPTERS = [
  { id: "intro",    label: "Intro"    },
  { id: "about",   label: "About"    },
  { id: "work",    label: "Work"     },
  { id: "web",     label: "Web"      },
  { id: "services",label: "Services" },
  { id: "stack",   label: "Stack"    },
  { id: "contact", label: "Contact"  },
];

/* ── AI Systems projects ──────────────────────────────── */
const PROJECTS = [
  {
    n: "01", title: "Sentinel", tag: "AI Operations · 2025", client: "Series-B SaaS",
    desc: "Autonomous monitoring agent triaging 10k+ events/day — replacing a 4-person on-call rotation.",
    metrics: [{ k: "92%", v: "Auto-resolved" }, { k: "<3min", v: "MTTR" }, { k: "10k+", v: "Events/day" }],
    image: sentinelImg, color: "#7fb0ff",
  },
  {
    n: "02", title: "Atlas", tag: "Workflow Automation · 2025", client: "European fintech",
    desc: "LLM-orchestrated back-office replacing 6 manual approval queues. Humans only see edge cases.",
    metrics: [{ k: "6→1", v: "Queues collapsed" }, { k: "84%", v: "Touchless" }, { k: "$2.1M", v: "Annual savings" }],
    image: atlasImg, color: "#9c88ff",
  },
  {
    n: "03", title: "Lumen", tag: "RAG Platform · 2024", client: "Enterprise legal",
    desc: "Multi-tenant retrieval grounding GPT-class models on 4M documents, sub-second latency.",
    metrics: [{ k: "4M", v: "Documents" }, { k: "780ms", v: "P95 latency" }, { k: "100%", v: "Cited answers" }],
    image: lumenImg, color: "#ffd06b",
  },
  {
    n: "04", title: "Orbit", tag: "Voice Agents · 2024", client: "Inbound SDR team",
    desc: "Real-time voice AI qualifying leads & booking meetings, 200ms latency, 24/7 coverage.",
    metrics: [{ k: "38%", v: "Meeting lift" }, { k: "200ms", v: "Voice latency" }, { k: "24/7", v: "Coverage" }],
    image: orbitImg, color: "#ff7faa",
  },
  {
    n: "05", title: "Nexus", tag: "SaaS Platform · 2025", client: "Independent Project",
    desc: "A fully self-serve SaaS platform for creating dynamic portfolio websites powered by AI.",
    metrics: [{ k: "1k+", v: "Active Users" }, { k: "$5k", v: "MRR" }, { k: "100%", v: "Automated" }],
    image: nexusImg, color: "#4ade80",
  },
  {
    n: "06", title: "DataPulse", tag: "Data Engineering · 2024", client: "E-commerce Brand",
    desc: "Real-time analytics engine processing millions of transactions to predict inventory shortages.",
    metrics: [{ k: "10M+", v: "Events/day" }, { k: "99.9%", v: "Uptime" }, { k: "3x", v: "Faster Insights" }],
    image: datapulseImg, color: "#38bdf8",
  },
];

/* ── Website / design projects ───────────────────────── */
const WEBSITES = [
  {
    n: "W/01", title: "FlowSync", category: "SaaS Landing Page", year: "2025",
    desc: "Full-stack marketing site for a workflow automation SaaS. 3D hero, animated feature reveals, and a conversion-optimised pricing page. Launched to 2k signups in 48h.",
    url: "https://flowsync.io", image: flowsyncImg,
    accentColor: "#9c88ff",
    tech: ["Next.js", "Three.js", "Framer Motion", "Tailwind"],
    features: ["3D hero animation", "Scroll-driven reveals", "A/B tested pricing", "99 Lighthouse score"],
  },
  {
    n: "W/02", title: "NovaPay", category: "Fintech Product Site", year: "2025",
    desc: "Marketing + onboarding site for a challenger bank. Focused on trust signals, mobile-first, and app store conversion. Achieved 4.8s avg session time.",
    url: "https://novapay.app", image: novapayImg,
    accentColor: "#7fb0ff",
    tech: ["Next.js", "GSAP", "Lottie", "Prismic CMS"],
    features: ["App store redirect flow", "Animated product previews", "Multi-language", "WCAG AA compliant"],
  },
  {
    n: "W/03", title: "Lumen Legal", category: "Enterprise B2B Site", year: "2024",
    desc: "Enterprise-grade site for an AI legal platform. Security-forward design, interactive product demos, and a gated case study portal for prospects.",
    url: "https://lumenlegal.ai", image: lumenLegalImg,
    accentColor: "#ffd06b",
    tech: ["Astro", "React", "GSAP ScrollTrigger", "Sanity"],
    features: ["Interactive product tour", "Gated case studies", "Enterprise security copy", "SOC2 badge flow"],
  },
  {
    n: "W/04", title: "OrbitVoice", category: "AI Product Landing", year: "2024",
    desc: "Conversion-first site for a voice AI startup. Real waveform demos, pricing calculator, and a live call simulator that prospects could try before signing up.",
    url: "https://orbitvoice.ai", image: orbitVoiceImg,
    accentColor: "#ff7faa",
    tech: ["Vite + React", "Tone.js", "Framer Motion", "Vercel"],
    features: ["Live voice demo widget", "Interactive pricing calc", "Confetti on signup", "Sub-1s load time"],
  },
  {
    n: "W/05", title: "Aura Scroll", category: "Creative Portfolio", year: "2025",
    desc: "A highly cinematic, interactive portfolio featuring 3D scroll effects and custom shaders.",
    url: "https://aura-scroll.dev", image: auraScrollImg,
    accentColor: "#a78bfa",
    tech: ["React Three Fiber", "GSAP", "TailwindCSS"],
    features: ["Custom shaders", "Scroll-linked 3D", "Premium typography", "Responsive design"],
  },
  {
    n: "W/06", title: "DevSaaS", category: "SaaS Boilerplate Site", year: "2025",
    desc: "The ultimate boilerplate marketing site with built-in auth flows, pricing, and docs.",
    url: "https://devsaas.io", image: devsaasImg,
    accentColor: "#34d399",
    tech: ["Next.js", "Supabase", "Framer Motion"],
    features: ["MDX Docs", "Stripe Integration", "Dark Mode", "SEO Optimized"],
  },
];

/* ── Services ─────────────────────────────────────────── */
const SERVICES = [
  {
    n: "S/01", title: "AI Strategy", icon: "🧭",
    body: "Diagnose where intelligence creates leverage. Roadmap aligned to revenue, not hype.",
    details: ["Opportunity mapping", "ROI modelling", "Build vs. buy analysis", "Executive workshops"],
  },
  {
    n: "S/02", title: "Agent Engineering", icon: "⚙️",
    body: "Production-grade autonomous systems with evals, guardrails, and observability built in.",
    details: ["LangGraph / custom agents", "Eval harnesses", "Human-in-loop design", "Observability dashboards"],
  },
  {
    n: "S/03", title: "Workflow Automation", icon: "🔁",
    body: "Replace repetitive operations with reliable, human-in-the-loop pipelines.",
    details: ["Process mining", "API orchestration", "Error handling", "Async pipelines"],
  },
  {
    n: "S/04", title: "Custom Integrations", icon: "🔌",
    body: "Wire models into your stack — CRM, ERP, comms, custom DBs — seamlessly.",
    details: ["CRM / ERP connectors", "Real-time webhooks", "Data migration", "Auth & security"],
  },
  {
    n: "S/05", title: "Web Engineering", icon: "🌐",
    body: "High-performance, visually stunning websites that convert visitors into customers.",
    details: ["Next.js / Vite", "3D & GSAP animations", "CMS integration", "Performance optimisation"],
  },
  {
    n: "S/06", title: "SaaS Products", icon: "🚀",
    body: "End-to-end architecture and development of scalable, revenue-generating SaaS platforms.",
    details: ["Full-stack architecture", "Authentication & Billing", "Multi-tenant DBs", "Scalable deployments"],
  },
];

const STACK = [
  "Python", "TypeScript", "LangGraph", "OpenAI", "Anthropic", "Postgres",
  "Pinecone", "Next.js", "Three.js", "Cloudflare", "Supabase", "Docker",
  "FastAPI", "LlamaIndex", "Redis", "Vercel", "GSAP", "Framer Motion",
];

/* ═══════════════════════════════════════════════════════ */

function Index() {
  const [loaded, setLoaded] = useState(false);
  const progress = useSmoothScrollProgress();
  const ids = useMemo(() => CHAPTERS.map((c) => c.id), []);
  const active = useActiveSection(ids);
  const mode: SceneMode = (active as SceneMode) || "intro";
  const handleLoaded = useCallback(() => setLoaded(true), []);

  return (
    <>
      <Preloader onComplete={handleLoaded} />

      {/* Fading overlay to replace the motion.main opacity animation without breaking CSS containing blocks */}
      <motion.div
        className="fixed inset-0 bg-background z-[100] pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: loaded ? 0 : 1 }}
        transition={{ duration: 1.2, ease: [0.7, 0, 0.2, 1] }}
      />

      <main id="top" className="relative bg-background text-foreground">
        <Suspense fallback={null}>
          <SceneCanvas progress={progress} mode={mode} />
        </Suspense>

        {/* Vignette */}
        <div
          aria-hidden
          className="fixed inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, oklch(0.06 0.012 250 / 0.85) 100%)",
          }}
        />

        <CursorGlow />
        <Nav active={active} chapters={CHAPTERS} />

        <div className="relative z-10">
          <IntroScene />
          <AboutSection />
          <ThesisScene />
          <WorkScene />
          <div id="web"><WebsiteShowcase projects={WEBSITES} /></div>
          <ServicesScene />
          <StackScene />
          <ContactScene />
          <Footer />
        </div>
      </main>
    </>
  );
}

/* ═══════════════ SCENES ═══════════════════════════════ */

function IntroScene() {
  return (
    <section
      id="intro"
      className="relative min-h-screen flex flex-col justify-between px-6 md:px-16 lg:px-24 pt-28 pb-16"
    >
      {/* Availability badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.8 }}
        className="flex justify-end"
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span
            className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Available Q3 2025
          </span>
        </div>
      </motion.div>

      {/* Hero text */}
      <div className="flex-1 flex items-center mt-12 z-10 relative pointer-events-none">
        <div className="w-full max-w-6xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="chapter-num mb-8"
          >
            <span className="text-primary mr-3">00</span> Portfolio · 2025
          </motion.p>

          <div className="overflow-visible mb-6 relative">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.8, delay: 0.8, ease: [0.7, 0, 0.2, 1] }}
            >
              <motion.h1
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="font-display font-light tracking-[-0.04em] text-[clamp(3.5rem,11vw,11rem)] leading-[0.9] pointer-events-auto"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Aryan
                <br />
                <span className="text-gradient italic font-extralight" style={{ fontFamily: "var(--font-display)" }}>
                  Garg
                </span>
              </motion.h1>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="text-base md:text-lg text-muted-foreground max-w-md leading-relaxed"
          >
            AI Engineer · Full-Stack Dev · SaaS Builder · 18 y/o · India 🇮🇳
          </motion.p>
        </div>
      </div>

      {/* Bottom row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.7 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-8 max-w-6xl mx-auto w-full"
      >
        <p className="text-sm text-muted-foreground/60 max-w-xs leading-relaxed">
          Independent engineer crafting AI systems & interfaces<br />
          that quietly run businesses.
        </p>

        <div className="flex items-center gap-6">
          <Magnetic strength={0.4}>
            <button
              onClick={() => scrollToId("about")}
              className="group flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              data-cursor="scroll"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <motion.span
                className="block w-8 h-px bg-primary"
                animate={{ scaleX: [1, 1.8, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                style={{ originX: 0 }}
              />
              Scroll to enter
            </button>
          </Magnetic>

          <Magnetic strength={0.4}>
            <a
              href="mailto:officialaryanworks@gmail.com"
              className="relative hidden md:inline-flex items-center justify-center h-12 px-7 rounded-full border border-white/15 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground overflow-hidden group transition-[color,border-color,background-color] duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] hover:text-foreground hover:border-white/25 hover:bg-white/[0.04]"
              data-cursor="email"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span className="relative z-10">Say hello ↗</span>
            </a>
          </Magnetic>
        </div>
      </motion.div>

      {/* Scroll line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.5, delay: 2.2, ease: [0.7, 0, 0.2, 1] }}
        className="absolute bottom-0 left-1/2 w-px h-16 bg-gradient-to-b from-transparent to-primary/40 origin-top"
      />
    </section>
  );
}

function ThesisScene() {
  return (
    <section id="ai" className="relative px-6 md:px-16 lg:px-24 py-32 min-h-[80vh] flex items-center">
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="chapter-num mb-10"
        >
          <span className="text-primary mr-3">02</span> The Thesis
        </motion.div>

        <TextScrub className="font-display font-light tracking-[-0.03em] text-[clamp(2rem,5.5vw,5.5rem)] leading-[1.08] max-w-5xl">
          I build AI systems that automate businesses. Not chatbots. Not demos. Production systems wired into your stack, accountable for real outcomes.
        </TextScrub>

        <div className="mt-20 grid grid-cols-3 gap-8 md:gap-16 max-w-3xl border-t border-white/8 pt-12">
          {[
            { k: "40+", v: "Systems shipped" },
            { k: "12",  v: "Industries"      },
            { k: "$8M+",v: "Cost saved"      },
          ].map((s, i) => (
            <motion.div
              key={s.v}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.12 }}
            >
              <div
                className="font-display text-3xl md:text-5xl font-light"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {s.k}
              </div>
              <div
                className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {s.v}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkScene() {
  return (
    <section 
      id="work" 
      className="relative" 
      style={{ backdropFilter: 'none', WebkitBackdropFilter: 'none' }}
    >
      <HorizontalScroll projects={PROJECTS} />
    </section>
  );
}

function ServicesScene() {
  return (
    <section id="services" className="relative px-6 md:px-16 lg:px-24 py-32">
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="chapter-num mb-6"
        >
          <span className="text-primary mr-3">04</span> Services
        </motion.div>

        <SplitReveal
          as="h2"
          by="word"
          className="font-display font-light tracking-[-0.03em] text-[clamp(2rem,5vw,4.5rem)] leading-[1] mb-16 max-w-3xl"
        >
          What I do, end to end.
        </SplitReveal>

        <ServiceHover services={SERVICES} />
      </div>
    </section>
  );
}

function StackScene() {
  return (
    <section id="stack" className="relative pb-16">
      {/* We remove the text header here because StackEcosystem includes its own title overlay for better immersion */}
      <StackEcosystem />
    </section>
  );
}

function ContactScene() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("officialaryanworks@gmail.com").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen flex items-center px-6 md:px-16 lg:px-24 py-32 overflow-hidden"
    >
      {/* Bloom */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, oklch(0.72 0.13 240 / 0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.7, 0, 0.2, 1] }}
        >
          <div className="chapter-num mb-8">
            <span className="text-primary mr-3">06</span> Contact
          </div>

          <SplitReveal
            as="h2"
            by="word"
            className="font-display font-extralight tracking-[-0.04em] text-[clamp(2.5rem,9vw,9rem)] leading-[0.92]"
          >
            Let's build something powerful.
          </SplitReveal>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-10 text-lg text-muted-foreground max-w-xl mx-auto"
          >
            Currently taking on a small number of engagements for Q3. Let's talk.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Magnetic strength={0.5}>
              <a
                href="mailto:officialaryanworks@gmail.com"
                className="group relative inline-flex items-center justify-center gap-3 h-12 px-7 rounded-full bg-primary/90 text-primary-foreground overflow-hidden border border-primary/40 transition-[background-color,border-color,transform] duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] hover:bg-primary"
                data-cursor="email"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[900ms] ease-[cubic-bezier(0.7,0,0.2,1)]"
                  style={{ background: "linear-gradient(90deg,transparent,oklch(1 1 1/0.18),transparent)" }}
                />
                <span className="relative font-mono text-[11px] uppercase tracking-[0.2em] z-10" style={{ fontFamily: "var(--font-mono)" }}>Let's build</span>
                <span className="relative z-10 transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:translate-x-1">→</span>
              </a>
            </Magnetic>

            <Magnetic strength={0.3}>
              <button
                onClick={handleCopy}
                className="inline-flex items-center justify-center h-12 px-7 rounded-full border border-white/10 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-[color,border-color,background-color] duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] hover:text-foreground hover:border-white/20 hover:bg-white/[0.04]"
                data-cursor="hover"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {copied ? "✓ Copied" : "Copy email"}
              </button>
            </Magnetic>

            <Magnetic strength={0.3}>
              <a
                href="https://cal.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center h-12 px-7 rounded-full border border-transparent font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-[color,border-color] duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] hover:text-foreground hover:border-white/10"
                data-cursor="book"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Book a call ↗
              </a>
            </Magnetic>
          </motion.div>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-14 flex items-center justify-center gap-8 flex-wrap"
          >
            {[
              { label: "GitHub",   href: "https://github.com/StrikerFr/"   },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/aryan-garg-828747381/" },
            ].map((s) => (
              <Magnetic key={s.label} strength={0.35}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition-colors"
                  data-cursor="hover"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {s.label}
                </a>
              </Magnetic>
            ))}
          </motion.div>

          {/* Back to Top */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-20 flex justify-center"
          >
            <Magnetic strength={0.4}>
              <button
                onClick={() => scrollToId("top")}
                className="group flex flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                data-cursor="hover"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 group-hover:bg-white/5 transition-all duration-500">
                  ↑
                </div>
                Back to top
              </button>
            </Magnetic>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 px-6 md:px-16 lg:px-24 py-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div
          className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          © 2026 Aryan Garg — Independent AI Engineer
        </div>
        <div
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Designed & built with ♥ from India
        </div>
      </div>
    </footer>
  );
}
