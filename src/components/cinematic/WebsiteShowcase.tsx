import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { SplitReveal } from "./SplitReveal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Magnetic } from "./Magnetic";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface WebsiteProject {
  n: string;
  title: string;
  category: string;
  year: string;
  desc: string;
  url: string;
  tech: string[];
  image: string;
  accentColor: string;
  features: string[];
}

interface WebsiteShowcaseProps {
  projects: WebsiteProject[];
}

const EASE = [0.7, 0, 0.2, 1] as const;

export function WebsiteShowcase({ projects }: WebsiteShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // 3D Tilt — subtle, premium
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), { damping: 30, stiffness: 200 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), { damping: 30, stiffness: 200 });
  const parallaxX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { damping: 30, stiffness: 200 });
  const parallaxY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-8, 8]), { damping: 30, stiffness: 200 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  useGSAP(() => {
    if (!containerRef.current) return;

    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      snap: {
        snapTo: 1 / (projects.length - 1),
        duration: { min: 0.3, max: 0.6 },
        delay: 0.1,
        ease: "power2.inOut",
      },
      onUpdate: (self) => {
        const progress = self.progress;
        let index = Math.round(progress * (projects.length - 1));
        if (index >= projects.length) index = projects.length - 1;
        if (index < 0) index = 0;
        setActiveIdx(index);
      }
    });

    return () => {
      scrollTrigger.kill();
    };
  }, { scope: containerRef, dependencies: [projects.length] });

  const scrollToProject = (index: number) => {
    if (!containerRef.current) return;
    const start = containerRef.current.offsetTop;
    const scrollDistance = (projects.length * window.innerHeight) - window.innerHeight;
    const targetProgress = index / (projects.length - 1);
    const targetScroll = start + (targetProgress * scrollDistance);
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  const cardVariants = {
    active: { opacity: 1, scale: 1, filter: "blur(0px)", y: 0 },
    past: (distance: number) => ({
      opacity: Math.max(0, 0.35 - distance * 0.12),
      scale: 0.95 - distance * 0.02,
      filter: "blur(6px)",
      y: -distance * 30
    }),
    future: { opacity: 0, scale: 1.04, filter: "blur(12px)", y: 50 }
  };

  const textContainerVariants = {
    active: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } },
    past: {},
    future: {}
  };

  const itemVariants = {
    active: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } },
    past: { opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.4 } },
    future: { opacity: 0, y: 15, filter: "blur(4px)", transition: { duration: 0.4 } }
  };

  const active = projects[activeIdx];

  return (
    <section ref={containerRef} className="relative w-full" style={{ height: `${projects.length * 100}vh` }}>
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-background px-6 md:px-16 lg:px-24">
        {/* Ambient accent wash that follows the active project */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          animate={{
            background: `radial-gradient(60% 50% at 70% 50%, ${active.accentColor}18 0%, transparent 60%), radial-gradient(40% 40% at 20% 80%, ${active.accentColor}10 0%, transparent 70%)`
          }}
          transition={{ duration: 1.2, ease: EASE }}
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-center h-full pt-20 pb-10">

          {/* Header row */}
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: EASE }}
                className="chapter-num mb-5 flex items-center gap-3"
              >
                <span className="text-primary">03</span>
                <span className="w-8 h-px bg-primary/40" />
                <span>Web Projects</span>
              </motion.div>

              <SplitReveal
                as="h2"
                by="word"
                className="font-display font-light tracking-[-0.04em] text-[clamp(2.25rem,5.5vw,5rem)] leading-[1] max-w-3xl"
              >
                Websites built to convert.
              </SplitReveal>
            </div>

            {/* Counter — feels like a film reel */}
            <div className="hidden md:flex items-baseline gap-2 font-mono text-muted-foreground/70" style={{ fontFamily: "var(--font-mono)" }}>
              <motion.span
                key={activeIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="text-3xl md:text-4xl font-light text-foreground tabular-nums"
              >
                {String(activeIdx + 1).padStart(2, "0")}
              </motion.span>
              <span className="text-xs tracking-[0.3em]">/ {String(projects.length).padStart(2, "0")}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-10 lg:gap-16 items-start h-[68vh]">

            {/* Left — project list navigation */}
            <div
              className="relative flex flex-col h-full overflow-y-auto pr-3 custom-scrollbar"
              style={{ maskImage: "linear-gradient(to bottom, transparent 0, black 8%, black 88%, transparent 100%)" }}
            >
              {/* Vertical guide line */}
              <div aria-hidden className="absolute left-0 top-0 bottom-0 w-px bg-white/5" />

              {projects.map((p, i) => {
                const isActive = activeIdx === i;
                const isPast = i < activeIdx;
                return (
                  <button
                    key={p.n}
                    onClick={() => scrollToProject(i)}
                    className="group relative text-left flex items-start gap-5 py-5 pl-6 pr-4 cursor-pointer"
                  >
                    {/* Active/Progress indicator bar */}
                    <motion.div
                      aria-hidden
                      className="absolute left-0 top-2 bottom-2 w-px rounded-full"
                      initial={false}
                      animate={{
                        opacity: isActive ? 1 : isPast ? 0.4 : 0,
                        backgroundColor: isActive ? p.accentColor : "rgba(255,255,255,0.3)",
                        boxShadow: isActive ? `0 0 12px ${p.accentColor}` : "none",
                      }}
                      transition={{ duration: 0.5, ease: EASE }}
                    />

                    {/* Number */}
                    <span
                      className={`font-mono text-[10px] uppercase tracking-[0.2em] pt-[6px] w-10 flex-shrink-0 transition-colors duration-500 ${
                        isActive ? "text-foreground" : "text-muted-foreground/40 group-hover:text-muted-foreground/80"
                      }`}
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {p.n}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <h3
                          className={`font-display text-xl md:text-2xl font-light transition-all duration-500 ${
                            isActive ? "text-foreground" : "text-muted-foreground/60 group-hover:text-foreground/90"
                          }`}
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {p.title}
                        </h3>
                        <span
                          className={`font-mono text-[10px] uppercase tracking-[0.25em] flex-shrink-0 transition-colors duration-500 ${
                            isActive ? "text-foreground/60" : "text-muted-foreground/30 group-hover:text-muted-foreground/60"
                          }`}
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {p.year}
                        </span>
                      </div>
                      <p className={`text-xs transition-colors duration-500 ${isActive ? "text-muted-foreground" : "text-muted-foreground/40 group-hover:text-muted-foreground/70"}`}>
                        {p.category}
                      </p>

                      {/* Tech pills — expand smoothly */}
                      <motion.div
                        initial={false}
                        animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-wrap gap-1.5 mt-4 pb-1">
                          {p.tech.map((t) => (
                            <span
                              key={t}
                              className="px-2.5 py-1 rounded-full text-[9px] font-mono uppercase tracking-[0.18em] border border-white/10 text-foreground/70 bg-white/[0.03]"
                              style={{ fontFamily: "var(--font-mono)" }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right — cinematic stacked preview */}
            <div
              className="relative h-full flex items-center justify-center"
              style={{ perspective: "1400px" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Soft accent halo behind the active card */}
              <motion.div
                aria-hidden
                className="absolute inset-x-8 inset-y-12 rounded-[28px] pointer-events-none"
                animate={{
                  boxShadow: `0 60px 120px -20px ${active.accentColor}40, 0 0 0 1px ${active.accentColor}10`,
                }}
                transition={{ duration: 1, ease: EASE }}
              />

              {projects.map((p, i) => {
                const isActive = activeIdx === i;
                const isPast = i < activeIdx;
                const distance = Math.abs(activeIdx - i);

                const state = isActive ? "active" : isPast ? "past" : "future";

                return (
                  <motion.div
                    key={p.n}
                    custom={distance}
                    variants={cardVariants}
                    initial="future"
                    animate={state}
                    transition={{ duration: 0.85, ease: EASE }}
                    className="absolute inset-0 w-full h-full flex flex-col rounded-2xl overflow-hidden border border-white/10"
                    style={{
                      zIndex: projects.length - distance,
                      background: "linear-gradient(180deg, oklch(0.10 0.018 250) 0%, oklch(0.06 0.012 250) 100%)",
                      boxShadow: isActive
                        ? `0 50px 120px oklch(0 0 0 / 0.85), 0 0 0 1px oklch(1 1 1 / 0.06) inset, 0 0 80px ${p.accentColor}25`
                        : `0 0 0 1px oklch(1 1 1 / 0.05) inset`,
                      rotateX: isActive ? rotateX : 0,
                      rotateY: isActive ? rotateY : 0,
                      transformStyle: "preserve-3d",
                      pointerEvents: isActive ? 'auto' : 'none'
                    }}
                  >
                    {/* Browser chrome */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-[oklch(0.09_0.015_250)] border-b border-white/5 relative z-20">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/[0.04] border border-white/5">
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: p.accentColor, boxShadow: `0 0 6px ${p.accentColor}` }}
                          />
                          <span className="font-mono text-[10px] text-muted-foreground/70 truncate" style={{ fontFamily: "var(--font-mono)" }}>
                            {p.url}
                          </span>
                        </div>
                      </div>
                      <span
                        className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/40 hidden md:inline"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {p.n}
                      </span>
                    </div>

                    {/* Screenshot with parallax (only active responds to mouse) */}
                    <div className="relative flex-1 overflow-hidden bg-black/50 min-h-0">
                      <motion.img
                        src={p.image}
                        alt={p.title}
                        className="absolute inset-0 w-[108%] h-[108%] max-w-none object-cover object-top -left-[4%] -top-[4%]"
                        style={{ x: isActive ? parallaxX : 0, y: isActive ? parallaxY : 0 }}
                      />
                      {/* Vignette */}
                      <div
                        aria-hidden
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: "radial-gradient(ellipse at center, transparent 50%, oklch(0 0 0 / 0.4) 100%)",
                        }}
                      />
                      {/* Bottom fade into footer */}
                      <div
                        aria-hidden
                        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
                        style={{
                          background: "linear-gradient(to top, oklch(0.07 0.014 250) 0%, transparent 100%)",
                        }}
                      />
                    </div>

                    {/* Card footer (Cinematic Stagger) */}
                    <motion.div
                      variants={textContainerVariants}
                      className="p-6 md:p-7 bg-[oklch(0.07_0.014_250)] relative z-20"
                    >
                      <div className="flex items-start justify-between gap-6 mb-4">
                        <div className="min-w-0">
                          <motion.div
                            variants={itemVariants}
                            className="flex items-center gap-3 mb-2"
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ background: p.accentColor, boxShadow: `0 0 10px ${p.accentColor}` }}
                            />
                            <span
                              className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/70"
                              style={{ fontFamily: "var(--font-mono)" }}
                            >
                              {p.category} · {p.year}
                            </span>
                          </motion.div>
                          <motion.h3
                            variants={itemVariants}
                            className="font-display text-2xl md:text-3xl font-light text-foreground mb-2 tracking-[-0.02em]"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            {p.title}
                          </motion.h3>
                          <motion.p
                            variants={itemVariants}
                            className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-2 max-w-xl"
                          >
                            {p.desc}
                          </motion.p>
                        </div>

                        <motion.div variants={itemVariants}>
                          <Magnetic strength={0.4}>
                            <a
                              href={p.url}
                              target="_blank"
                              rel="noreferrer"
                              className="group/btn relative inline-flex items-center gap-2 h-11 px-6 rounded-full text-[11px] font-mono uppercase tracking-[0.22em] border border-white/15 text-foreground overflow-hidden transition-[border-color,background-color] duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] hover:border-white/30 hover:bg-white/[0.04]"
                              style={{ fontFamily: "var(--font-mono)" }}
                              data-cursor="view"
                            >
                              <span
                                aria-hidden
                                className="absolute inset-0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-[900ms] ease-[cubic-bezier(0.7,0,0.2,1)]"
                                style={{ background: "linear-gradient(90deg,transparent,oklch(1 1 1/0.18),transparent)" }}
                              />
                              <span className="relative z-10">Visit</span>
                              <span className="relative z-10 transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover/btn:translate-x-1">↗</span>
                            </a>
                          </Magnetic>
                        </motion.div>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 border-t border-white/5 pt-5">
                        {p.features.map((f) => (
                          <motion.span
                            key={f}
                            variants={itemVariants}
                            className="flex items-center gap-2 text-xs text-muted-foreground/70"
                          >
                            <span
                              className="w-1 h-1 rounded-full flex-shrink-0"
                              style={{ background: p.accentColor, boxShadow: `0 0 6px ${p.accentColor}` }}
                            />
                            {f}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
