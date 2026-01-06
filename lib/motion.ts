export const motion = {
  duration: {
    micro: "120ms" as const,
    macro: "450ms" as const,
    scene: "600ms" as const,
    tier1: "160ms" as const,
    tier2: "300ms" as const,
    tier3: "500ms" as const,
  },
  easing: {
    "ease-out-cubic": "cubic-bezier(0.33, 1, 0.68, 1)" as const,
    "ease-in-out-cubic": "cubic-bezier(0.65, 0, 0.35, 1)" as const,
    "ease-out-quint": "cubic-bezier(0.23, 1, 0.32, 1)" as const,
    "ease-in-out-quint": "cubic-bezier(0.83, 0, 0.17, 1)" as const,
    "ease-out-quart": "cubic-bezier(0.25, 1, 0.5, 1)" as const,
    "ease-out-back": "cubic-bezier(0.34, 1.56, 0.64, 1)" as const,
  },
  spring: {
    stiffness: 300,
    damping: 0.7,
  },
} as const

export const animation = {
  enter: {
    fade: {
      from: "opacity-0",
      to: "opacity-100",
    },
    scale: {
      from: "scale-95",
      to: "scale-100",
    },
    slideUp: {
      from: "translate-y-2",
      to: "translate-y-0",
    },
  },
  exit: {
    fade: {
      from: "opacity-100",
      to: "opacity-0",
    },
    slideDown: {
      from: "translate-y-0",
      to: "translate-y-2",
    },
  },
  hover: {
    lift: {
      translateY: "-2px",
      duration: motion.duration.micro,
      easing: motion.easing["ease-out-cubic"],
    },
  },
  stagger: {
    baseDelay: motion.duration.micro,
    staggerDelay: "18ms" as const,
  },
} as const

export type MotionConfig = {
  duration: (typeof motion.duration)[keyof typeof motion.duration]
  easing: (typeof motion.easing)[keyof typeof motion.easing]
}

export const transitions = {
  default: `${motion.duration.micro} ${motion.easing["ease-out-cubic"]}`,
  hover: `${motion.duration.micro} ${motion.easing["ease-out-cubic"]}`,
  focus: `${motion.duration.micro} ${motion.easing["ease-out-cubic"]}`,
  modal: `${motion.duration.macro} ${motion.easing["ease-out-quint"]}`,
  page: `${motion.duration.scene} ${motion.easing["ease-in-out-quint"]}`,
  sidebar: `350ms ${motion.easing["ease-out-quart"]}`,
} as const

export const elevation = {
  0: {
    shadow: "none",
    translateY: "0",
  },
  1: {
    shadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    translateY: "-1px",
  },
  2: {
    shadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    translateY: "-2px",
  },
  3: {
    shadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    translateY: "-3px",
  },
  4: {
    shadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    translateY: "-4px",
  },
  5: {
    shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    translateY: "-5px",
  },
} as const

export const getTransition = (
  type: "default" | "hover" | "focus" | "modal" | "page" | "sidebar" = "default"
) => transitions[type]

export const getElevation = (level: keyof typeof elevation) => elevation[level]
