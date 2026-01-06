type ScaleRatio = 1.125 | 1.25 | 1.333 | 1.414 | 1.618

type ColorName =
  | "primary"
  | "secondary"
  | "background"
  | "foreground"
  | "card"
  | "card-foreground"
  | "popover"
  | "popover-foreground"
  | "primary-foreground"
  | "secondary-foreground"
  | "muted"
  | "muted-foreground"
  | "accent"
  | "accent-foreground"
  | "destructive"
  | "border"
  | "input"
  | "ring"

type RadiusSize =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "full"

type SpacingScale = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10" | "12" | "16" | "20" | "24"

type TypographyScale = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl"

type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5

type MotionDuration = 120 | 240 | 300 | 350 | 400 | 450 | 600

type EasingCurve = "ease-out-cubic" | "ease-in-out-cubic" | "ease-out-quint" | "ease-in-out-quint" | "ease-out-quart" | "ease-out-back"

interface DesignToken<T> {
  value: T
  type: string
}

interface SpacingToken extends DesignToken<string> {
  type: "spacing"
}

interface RadiusToken extends DesignToken<string> {
  type: "radius"
  curvature: number
}

interface TypographyToken extends DesignToken<{
  fontSize: string
  lineHeight: string
  letterSpacing: string
}> {
  type: "typography"
  scale: number
}

interface MotionToken extends DesignToken<{
  duration: MotionDuration
  easing: EasingCurve
}> {
  type: "motion"
}

interface ShadowToken extends DesignToken<{
  blur: string
  offsetY: string
  color: string
  opacity: number
}> {
  type: "shadow"
  elevation: ElevationLevel
}

interface ColorPalette {
  light: string
  DEFAULT: string
  dark: string
}

interface DesignSystemConfig {
  colors: Record<ColorName, ColorPalette>
  spacing: Record<SpacingScale, SpacingToken>
  radii: Record<RadiusSize, RadiusToken>
  typography: Record<TypographyScale, TypographyToken>
  motion: Record<"micro" | "macro" | "scene", MotionToken>
  shadows: Record<ElevationLevel, ShadowToken>
}

type ColorVariant = "50" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | "950"

type TailwindColorValue = `${ColorName}-${ColorVariant}` | ColorName

type TailwindSpacingValue = SpacingScale | `-[${string}]`

type TailwindRadiusValue = RadiusSize | `-[${string}]`

type TailwindTypographyValue = `text-${TypographyScale}`

interface ComponentVariants<T extends string> {
  [key: string]: T
}

type ExtractVariantValues<T> = T extends { variants: { [K: string]: infer V } } ? V : never

type SizeConfig<T extends string> = Record<T, { min: string; max: string }>

type ResponsiveValue<T> = T | { base: T; sm?: T; md?: T; lg?: T; xl?: T }

type GridConfig = {
  columns: number
  gutterRatio: number
  marginRatio: number
}

type AspectRatio = "1:1" | "4:3" | "3:2" | "16:9" | "phi:1"

type MotionTier = 1 | 2 | 3

interface AnimationConfig {
  enter: {
    opacity: [number, number]
    scale?: [number, number]
    translateY?: [number, number]
  }
  exit: {
    opacity: [number, number]
    translateY: [number, number]
  }
  duration: MotionDuration
  easing: EasingCurve
}

interface StaggerConfig {
  baseDelay: MotionDuration
  staggerDelay: MotionDuration
  sequence: string[]
}

export type {
  DesignSystemConfig,
  ColorName,
  ColorPalette,
  RadiusSize,
  SpacingScale,
  TypographyScale,
  ElevationLevel,
  MotionDuration,
  EasingCurve,
  MotionTier,
  ColorVariant,
  SpacingToken,
  RadiusToken,
  TypographyToken,
  MotionToken,
  ShadowToken,
  TailwindColorValue,
  TailwindSpacingValue,
  TailwindRadiusValue,
  TailwindTypographyValue,
  ComponentVariants,
  SizeConfig,
  ResponsiveValue,
  GridConfig,
  AspectRatio,
  AnimationConfig,
  StaggerConfig,
}
