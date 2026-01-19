"use client";

import { AnimatePresence, motion, type Variants } from "motion/react";
import { useState, useId } from "react";
import { cn } from "@/lib/utils";

type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  glowColor: string;
  href: string;
};

const GOOEY_SPRING = {
  type: "spring",
  stiffness: 400,
  damping: 28,
  mass: 1,
} as const;

// Arc positions fanning out to top-left (for bottom-right corner placement)
// Angles: 100°, 130°, 160°, 190° at radius 95px - wider spread
const BUTTON_POSITIONS = [
  { x: -16, y: -94 },  // Nearly straight up (Home)
  { x: -61, y: -73 },  // Upper diagonal (Learn)
  { x: -89, y: -33 },  // Lower diagonal (Vault)
  { x: -94, y: 16 },   // Nearly straight left (GitHub)
] as const;


const itemVariants: Variants = {
  closed: (i: number) => ({
    x: 0,
    y: 0,
    scale: 0.3,
    opacity: 0,
    transition: {
      ...GOOEY_SPRING,
      delay: (3 - i) * 0.03,
    },
  }),
  open: (i: number) => ({
    x: BUTTON_POSITIONS[i].x,
    y: BUTTON_POSITIONS[i].y,
    scale: 1,
    opacity: 1,
    transition: {
      ...GOOEY_SPRING,
      delay: i * 0.04,
    },
  }),
};

const SpeedDialNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const filterId = useId();

  const navItems: NavItem[] = [
    {
      id: "home",
      label: "Home",
      icon: <HomeIcon />,
      color: "bg-blue-500",
      glowColor: "shadow-blue-500/50",
      href: "/",
    },
    {
      id: "learn",
      label: "Learn",
      icon: <GradCapIcon />,
      color: "bg-emerald-500",
      glowColor: "shadow-emerald-500/50",
      href: "/modules",
    },
    {
      id: "vault",
      label: "Vault",
      icon: <VaultIcon />,
      color: "bg-rose-500",
      glowColor: "shadow-rose-500/50",
      href: "/vault",
    },
    {
      id: "github",
      label: "GitHub",
      icon: <GitHubIcon />,
      color: "bg-amber-400",
      glowColor: "shadow-amber-400/50",
      href: "https://github.com/dutch-casa/web.dev.site",
    },
  ];

  return (
    <div className="relative flex items-center justify-center">
      {/* Gooey SVG Filter */}
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -9"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Gooey Container */}
      <motion.div
        style={{ filter: `url(#${filterId})` }}
        className="relative flex items-center justify-center"
      >
        {/* Radial Nav Items */}
        <AnimatePresence mode="popLayout">
          {navItems.map((item, index) => (
            <motion.a
              key={item.id}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              custom={index}
              variants={itemVariants}
              initial="closed"
              animate={isOpen ? "open" : "closed"}
              className={cn(
                "absolute flex size-12 items-center justify-center rounded-full",
                "cursor-pointer transition-shadow duration-150",
                item.color,
                isOpen && `shadow-lg ${item.glowColor}`
              )}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              aria-label={item.label}
            >
              <span className="text-white">{item.icon}</span>
            </motion.a>
          ))}
        </AnimatePresence>

        {/* Center Toggle Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "relative z-10 flex size-14 items-center justify-center rounded-full",
            "bg-neutral-900 text-white cursor-pointer",
            "shadow-xl shadow-neutral-900/30",
            "hover:bg-neutral-800 transition-colors duration-150"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isOpen}
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={GOOEY_SPRING}
          >
            <PlusIcon isOpen={isOpen} />
          </motion.div>
        </motion.button>
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Icons - Custom SVGs for crisp rendering
   ───────────────────────────────────────────────────────────────────────────── */

function PlusIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path
        d="M12 5v14"
        animate={{ opacity: isOpen ? 1 : 1 }}
      />
      <motion.path
        d="M5 12h14"
        animate={{ opacity: isOpen ? 1 : 1 }}
      />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function GradCapIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5" />
    </svg>
  );
}

function VaultIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="12" x2="14" y2="14" />
      <line x1="3" y1="21" x2="3" y2="23" />
      <line x1="21" y1="21" x2="21" y2="23" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export { SpeedDialNav };
