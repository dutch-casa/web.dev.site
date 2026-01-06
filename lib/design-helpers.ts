import { motion, elevation } from "./motion"

type RadiusSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"

type SpacingScale = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10" | "12" | "16" | "20" | "24"

type TypographyScale = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl"

const BASE_SPACING = 0.25
const BASE_RADIUS = 0.625
const BASE_FONT_SIZE = 1
const MODULAR_RATIO = 1.25

export const designTokens = {
  spacing: {
    0: "0",
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    8: "2rem",
    10: "2.5rem",
    12: "3rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
  } as const,

  radius: {
    sm: "calc(10px - 4px)",
    md: "calc(10px - 2px)",
    lg: "10px",
    xl: "calc(10px + 4px)",
    "2xl": "calc(10px + 8px)",
    "3xl": "calc(10px + 12px)",
    "4xl": "calc(10px + 16px)",
    full: "9999px",
  } as const,

  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
  } as const,

  lineHeight: {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.625",
  } as const,
} as const

export const getSpacing = (scale: SpacingScale): string => designTokens.spacing[scale]

export const getRadius = (size: RadiusSize): string => designTokens.radius[size]

export const getFontSize = (scale: TypographyScale): string => designTokens.fontSize[scale]

export const getLineHeight = (scale: "tight" | "normal" | "relaxed"): string => designTokens.lineHeight[scale]

export const modularScale = (
  base: number,
  steps: number,
  ratio: number = MODULAR_RATIO
): string => {
  const value = base * Math.pow(ratio, steps)
  return `${value}rem`
}

export const calculateColumnWidth = (
  containerWidth: number,
  nColumns: number,
  gutterRatio: number = 0.25
): number => {
  const gutter = containerWidth * gutterRatio
  return (containerWidth - gutter * (nColumns - 1)) / nColumns
}

export const calculateElevation = (
  level: 0 | 1 | 2 | 3 | 4 | 5
): { shadow: string; translateY: string } => elevation[level]

export const getContrastRatio = (l1: number, l2: number): number => {
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export const spacing = {
  xs: "0.125rem",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "1rem",
  xl: "1.5rem",
  "2xl": "2rem",
  "3xl": "3rem",
} as const

export const radius = {
  pill: "9999px",
  "2xl": "1rem",
  xl: "0.875rem",
  lg: "0.625rem",
  md: "0.5rem",
  sm: "0.375rem",
} as const

export const typography = {
  xs: { fontSize: "0.75rem", lineHeight: "1rem" },
  sm: { fontSize: "0.875rem", lineHeight: "1.25rem" },
  base: { fontSize: "1rem", lineHeight: "1.5rem" },
  lg: { fontSize: "1.125rem", lineHeight: "1.75rem" },
  xl: { fontSize: "1.25rem", lineHeight: "1.75rem" },
  "2xl": { fontSize: "1.5rem", lineHeight: "2rem" },
  "3xl": { fontSize: "1.875rem", lineHeight: "2.25rem" },
  "4xl": { fontSize: "2.25rem", lineHeight: "2.5rem" },
  "5xl": { fontSize: "3rem", lineHeight: "1" },
} as const

export const grid = {
  columns: 12,
  gutter: "1rem",
  maxWidth: "1280px",
} as const
