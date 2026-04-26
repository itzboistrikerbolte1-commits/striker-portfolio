import { useState } from "react";
import { motion, useScroll, useSpring, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Magnetic } from "./Magnetic";
import { scrollToId } from "@/lib/scrollTo";

const DEFAULT_LINKS = [
  { id: "about",    label: "About"    },
  { id: "work",     label: "Work"     },
  { id: "web",      label: "Web"      },
  { id: "services", label: "Services" },
  { id: "contact",  label: "Contact"  },
];

const PREMIUM_EASE = [0.4, 0, 0.2, 1] as const;

const navVariants = {
  hidden: {
    y: -100,
    opacity: 0,
    transition: { duration: 0.6, ease: PREMIUM_EASE }
  },
  intro: { 
    y: 0, opacity: 1,
    backgroundColor: "rgba(10, 10, 15, 0)", 
    borderColor: "rgba(255, 255, 255, 0)",
    borderRadius: "99px",
    boxShadow: "0 0 0px rgba(0,0,0,0)",
    backdropFilter: "blur(0px)",
    scale: 0.98,
    transition: { duration: 0.8, ease: PREMIUM_EASE }
  },
  about: {
    y: 0, opacity: 1,
    backgroundColor: "rgba(15, 15, 25, 0.6)", 
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: "99px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset",
    backdropFilter: "blur(12px)",
    scale: 1,
    transition: { duration: 0.8, ease: PREMIUM_EASE }
  },
  services: {
    y: 0, opacity: 1,
    backgroundColor: "rgba(15, 15, 25, 0.6)", 
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: "99px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset",
    backdropFilter: "blur(12px)",
    scale: 1,
    transition: { duration: 0.8, ease: PREMIUM_EASE }
  },
  work: { 
    y: 0, opacity: 1,
    backgroundColor: "rgba(20, 20, 35, 0.7)", 
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: "99px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(156, 136, 255, 0.15), 0 0 0 1px rgba(255,255,255,0.1) inset",
    backdropFilter: "blur(16px)",
    scale: 1.02,
    transition: { duration: 0.8, ease: PREMIUM_EASE }
  },
  web: {
    y: 0, opacity: 1,
    backgroundColor: "rgba(20, 20, 35, 0.7)", 
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: "99px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(156, 136, 255, 0.15), 0 0 0 1px rgba(255,255,255,0.1) inset",
    backdropFilter: "blur(16px)",
    scale: 1.02,
    transition: { duration: 0.8, ease: PREMIUM_EASE }
  },
  stack: {
    y: 0, opacity: 1,
    backgroundColor: "rgba(10, 15, 20, 0.85)", 
    borderColor: "rgba(100, 255, 200, 0.25)",
    borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.8), 0 0 15px rgba(100, 255, 200, 0.15), 0 0 0 1px rgba(100, 255, 200, 0.15) inset",
    backdropFilter: "blur(16px)",
    scale: 1,
    transition: { duration: 0.8, ease: PREMIUM_EASE }
  },
  contact: {
    y: 0, opacity: 1,
    backgroundColor: "rgba(15, 15, 25, 0.5)", 
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: "99px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset",
    backdropFilter: "blur(12px)",
    scale: 1,
    transition: { duration: 0.8, ease: PREMIUM_EASE }
  }
};

export function Nav({ active = "intro", chapters = DEFAULT_LINKS }: { active?: string, chapters?: {id: string, label: string}[] }) {
  const { scrollY, scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    // Hide when scrolling down past 150px, reveal when scrolling up
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  // Determine current variant state
  let currentState = "intro";
  if (navVariants[active as keyof typeof navVariants]) {
    currentState = active;
  } else if (active !== "intro") {
    currentState = "about"; // fallback for standard view
  }

  return (
    <>
      {/* Side Progress Rail (Vertical) */}
      <div className="fixed right-6 top-1/4 bottom-1/4 w-[2px] z-50 pointer-events-none hidden lg:block overflow-hidden rounded-full bg-white/5">
        <motion.div 
          className="absolute top-0 left-0 w-full bg-primary origin-top"
          style={{ scaleY, height: '100%', boxShadow: "0 0 15px var(--color-primary)" }}
        />
      </div>

      <div className="fixed top-4 md:top-6 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
        <motion.header
          variants={navVariants}
          initial="intro"
          animate={hidden ? "hidden" : currentState}
          className="pointer-events-auto flex items-center p-1.5 relative overflow-hidden"
          style={{ borderStyle: "solid", borderWidth: "1px" }}
        >
          {/* Logo Area */}
          <Magnetic strength={0.3}>
            <button
              onClick={() => scrollToId("top")}
              className="flex items-center gap-2 cursor-pointer group pl-4 pr-3 py-1.5"
            >
              {/* Pulsing Dot */}
              <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-primary/30 group-hover:scale-150 transition-transform duration-500" />
                <div className="absolute w-1.5 h-1.5 rounded-full bg-primary" />
              </div>
              <span
                className="font-display font-medium tracking-tight text-sm text-foreground hidden sm:block"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Aryan Garg
              </span>
            </button>
          </Magnetic>

          <AnimatePresence>
            {active !== "intro" && (
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="w-px h-6 bg-white/10 hidden md:block mx-1" 
              />
            )}
          </AnimatePresence>

          {/* Center Nav - Dynamic Island Links */}
          <nav
            className="hidden md:flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {chapters.map((c, i) => {
              const isActive = active === c.id;
              
              // Hide nav items gracefully in intro state to maintain minimalism
              if (active === "intro" && c.id !== "intro") return null;

              return (
                <Magnetic key={c.id} strength={0.25}>
                  <button
                    onClick={() => scrollToId(c.id)}
                    className={`relative px-3 py-2 transition-colors duration-500 cursor-pointer rounded-full flex items-center gap-2 overflow-hidden ${
                      isActive ? "text-foreground" : "hover:text-foreground"
                    }`}
                  >
                    {/* Active State Container */}
                    {isActive && (
                      <>
                        <motion.span
                          layoutId="nav-active-bg"
                          className="absolute inset-0 rounded-full bg-white/5"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                        {/* Energy Dot */}
                        <motion.span
                          layoutId="nav-energy-dot"
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-t-full bg-primary"
                          style={{ boxShadow: "0 -2px 10px var(--color-primary)" }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      </>
                    )}
                    
                    {/* Content Container (z-10 to stay above bg) */}
                    <span className="relative z-10 flex items-center gap-1.5">
                      {/* Expandable Chapter Number */}
                      <AnimatePresence>
                        {isActive && active !== "intro" && (
                          <motion.span
                            initial={{ width: 0, opacity: 0, paddingRight: 0, marginRight: 0 }}
                            animate={{ width: "auto", opacity: 1, paddingRight: 6, marginRight: 2 }}
                            exit={{ width: 0, opacity: 0, paddingRight: 0, marginRight: 0 }}
                            transition={{ duration: 0.5, ease: PREMIUM_EASE }}
                            className="text-primary font-bold inline-block overflow-hidden whitespace-nowrap border-r border-primary/30"
                          >
                            {String(i + 1).padStart(2, "0")}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      
                      <motion.span layout className={isActive ? "font-medium" : ""}>
                        {c.label}
                      </motion.span>
                    </span>
                  </button>
                </Magnetic>
              );
            })}
          </nav>

          {/* Mobile active indicator (shows only current section on small screens) */}
          <div className="md:hidden flex items-center px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 animate-pulse" />
            {chapters.find((c) => c.id === active)?.label || "Menu"}
          </div>

          <AnimatePresence>
            {active !== "intro" && (
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="w-px h-6 bg-white/10 mx-1 hidden sm:block" 
              />
            )}
          </AnimatePresence>

          {/* Special Contact CTA */}
          <div className="pr-1 pl-1 hidden sm:block">
            <Magnetic strength={0.4}>
              <button
                onClick={() => scrollToId("contact")}
                className={`relative text-[10px] uppercase tracking-[0.25em] font-mono px-5 py-2.5 rounded-full border transition-all duration-700 cursor-pointer overflow-hidden group ${
                  active === "contact" 
                    ? "border-primary bg-primary/20 text-primary-foreground" 
                    : "border-primary/20 bg-primary/5 hover:border-primary/50 hover:bg-primary/15 text-foreground"
                }`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {/* Continuous Pulse Loop */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{ boxShadow: ["0 0 0px var(--color-primary) inset", "0 0 15px var(--color-primary) inset", "0 0 0px var(--color-primary) inset"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Micro ripple light sweep */}
                <span
                  aria-hidden
                  className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-[800ms]"
                  style={{ background: "linear-gradient(90deg,transparent,oklch(0.72 0.13 240/0.4),transparent)" }}
                />
                <span className="relative z-10 flex items-center gap-1.5">
                  Let's talk
                  {active === "contact" && (
                    <motion.span 
                      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
                      className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]"
                    />
                  )}
                </span>
              </button>
            </Magnetic>
          </div>
        </motion.header>
      </div>
    </>
  );
}
