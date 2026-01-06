import type { ButtonVariants } from "@/lib/ui-types"

type Brand = "Auburn"
type Theme = "light" | "dark"

type ButtonVariant = ButtonVariants["variant"]
type ButtonSize = ButtonVariants["size"]

type Elevation = 0 | 1 | 2 | 3 | 4 | 5
type Spacing = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"
type Typography = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl"

interface MotionConfig {
  duration: number
  easing: string
}

type ComponentProps<T extends string> = {
  [K in T]?: unknown
}

interface WithChildren {
  children: React.ReactNode
}

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never

type LastOf<T> = UnionToIntersection<T extends unknown ? () => T : never> extends () => infer R
  ? R
  : never

type TupleKeys<T extends any[]> = Exclude<keyof T, keyof any[]>

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T]

type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never
}[keyof T]

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
    }
  : T

type DeepRequired<T> = T extends object
  ? {
      [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P]
    }
  : T

type Exact<T, Shape> = T extends Shape
  ? [Shape] extends [T]
    ? T
    : Shape
  : never

type Merge<A, B> = Omit<A, keyof B> & B

type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

type OneOf<T extends Record<string, any>> = {
  [K in keyof T]: Required<Pick<T, K>> & Partial<Record<Exclude<keyof T, K>, never>>
}[keyof T & string]

type Opaque<Type, Token = unknown> = Type & { readonly __opaque__: unique symbol }

type BrandColor<T extends Brand> = `brand-${T}-${"orange" | "blue"}`

type SemanticColor =
  | "primary"
  | "secondary"
  | "accent"
  | "destructive"
  | "success"
  | "warning"
  | "info"

type AsyncStateStatus = "idle" | "loading" | "success" | "error"

type AsyncState<TData, TError = Error> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: TData }
  | { status: "error"; error: TError }

type StateEnum<T extends string> = { [K in T]: readonly string[] }

type RecordPartial<T extends Record<string, any>> = {
  [K in keyof T]?: T[K]
}

type Overwrite<T, O> = Omit<T, keyof O> & O

type Widen<T> = T extends string
  ? string
  : T extends number
  ? number
  : T extends boolean
  ? boolean
  : T extends bigint
  ? bigint
  : T extends symbol
  ? symbol
  : T extends undefined
  ? undefined
  : T extends Function
  ? Function
  : T extends object
  ? { [K in keyof T]: Widen<T[K]> }
  : unknown

type IsAny<T, Y = true, N = false> = 0 extends 1 & T ? Y : N

type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
  ? true
  : false

export type {
  Brand,
  Theme,
  ButtonVariant,
  ButtonSize,
  Elevation,
  Spacing,
  Typography,
  MotionConfig,
  ComponentProps,
  WithChildren,
  UnionToIntersection,
  LastOf,
  Optional,
  RequiredKeys,
  OptionalKeys,
  DeepPartial,
  DeepRequired,
  Exact,
  Merge,
  Prettify,
  OneOf,
  Opaque,
  BrandColor,
  SemanticColor,
  AsyncStateStatus,
  AsyncState,
  StateEnum,
  RecordPartial,
  Overwrite,
  Widen,
  IsAny,
  Equals,
}
