# Auburn University Club - Design System

## Overview

Modern, mathematical design system built with Tailwind CSS v4.1, TypeScript, and Base UI components.

**Guiding Principles**
- Data dominates - choose right data structures, algorithms write themselves
- Composition over configuration
- Zero uncertainty - invalid states unrepresentable
- Delightful DX - types guide implementation
- Apple-inspired motion - hierarchy, causality, rhythm

## Brand Colors

### Auburn University Colors (OKLCH)

```css
--primary: oklch(0.694 0.202 42);     /* Auburn Orange #FE6515 */
--secondary: oklch(0.251 0.093 258);   /* Auburn Blue #001F4D */
```

**Why OKLCH?** Perceptually uniform color space. Equal numerical changes = equal perceptual changes. Enables consistent lightness across hues.

## Typography

### Modular Scale (1.25 ratio)

| Scale | Font Size | Line Height |
|-------|-----------|-------------|
| xs    | 0.75rem   | 1rem        |
| sm    | 0.875rem  | 1.25rem     |
| base  | 1rem      | 1.5rem      |
| lg    | 1.125rem  | 1.75rem     |
| xl    | 1.25rem   | 1.75rem     |
| 2xl   | 1.5rem    | 2rem        |
| 3xl   | 1.875rem  | 2.25rem     |
| 4xl   | 2.25rem   | 2.5rem      |
| 5xl   | 3rem      | 1           |

**Mathematical Formula**
```
next_size = current_size × ratio (1.25)
line_height = font_size × 1.4-1.6
```

## Spacing

### Base Grid (4px)

| Scale  | Value  | Formula              |
|--------|--------|---------------------|
| 0      | 0      | -                   |
| 1      | 0.25rem| base × 1           |
| 2      | 0.5rem | base × 2           |
| 3      | 0.75rem| base × 3           |
| 4      | 1rem   | base × 4           |
| 5      | 1.25rem| base × 5           |
| 6      | 1.5rem | base × 6           |
| 8      | 2rem   | base × 8           |
| 10     | 2.5rem | base × 10          |
| 12     | 3rem   | base × 12          |

### Mathematical Rules

```
spacing_n = base_spacing × n
padding_inner = padding_outer / 2
gutter = column_width × gutter_ratio (0.25)
margin = container_width × margin_ratio (0.05)
```

## Radius (Pill-shaped)

**Base Radius:** 0.625rem (10px)

| Size   | Value            | Formula                  |
|--------|------------------|--------------------------|
| sm     | calc(10px - 4px) | base - 4px              |
| md     | calc(10px - 2px) | base - 2px              |
| lg     | 10px             | base                    |
| xl     | calc(10px + 4px) | base + 4px              |
| 2xl    | calc(10px + 8px) | base + 8px              |
| 3xl    | calc(10px + 12px)| base + 12px             |
| 4xl    | calc(10px + 16px)| base + 16px             |
| full   | 9999px           | circle                  |

**Formula**
```
corner_radius = min(height, width) / curvature_factor
outer_radius = inner_radius + padding
```

## Motion (Apple-inspired)

### Durations (snapped to 120Hz frames)

| Tier    | Duration | Purpose              |
|---------|----------|----------------------|
| micro   | 120ms    | Feedback             |
| tier1   | 160ms    | Feedback             |
| tier2   | 300ms    | Context             |
| tier3   | 500ms    | Scene change        |
| macro   | 450ms    | Contextual          |
| scene   | 600ms    | Page transition      |

### Easing Curves

```css
ease-out-cubic:    cubic-bezier(0.33, 1, 0.68, 1)
ease-in-out-cubic: cubic-bezier(0.65, 0, 0.35, 1)
ease-out-quint:    cubic-bezier(0.23, 1, 0.32, 1)
ease-in-out-quint: cubic-bezier(0.83, 0, 0.17, 1)
ease-out-quart:   cubic-bezier(0.25, 1, 0.5, 1)
ease-out-back:    cubic-bezier(0.34, 1.56, 0.64, 1)
```

### Elevation

| Level | Shadow                                      | Translate Y |
|-------|---------------------------------------------|------------|
| 0     | none                                        | 0          |
| 1     | 0 1px 2px 0 rgb(0 0 0 / 0.05)          | -1px       |
| 2     | 0 1px 3px 0 rgb(0 0 0 / 0.1)           | -2px       |
| 3     | 0 4px 6px -1px rgb(0 0 0 / 0.1)       | -3px       |
| 4     | 0 10px 15px -3px rgb(0 0 0 / 0.1)     | -4px       |
| 5     | 0 20px 25px -5px rgb(0 0 0 / 0.1)     | -5px       |

**Formula**
```
shadow_blur = elevation × 1.5
shadow_offset_y = elevation × 0.5
translate_y = -elevation × 0.25
```

### Stagger

```css
stagger_delay = index × (base_duration × 0.15)
```

**Fast:** 24ms stagger
**Medium:** 45ms stagger
**Slow:** 68ms stagger

### Sequencing

1. Container
2. Content
3. Affordance

## Components

### Button

**Variants**
- `default` - Primary Auburn Orange
- `pill` - Fully rounded
- `pill-outline` - Outlined pill
- `pill-ghost` - Ghost pill
- `outline` - Standard outline
- `secondary` - Auburn Blue
- `ghost` - No background
- `destructive` - Error state
- `link` - Text link

**Sizes**
- `xs` - 24px height
- `sm` - 32px height
- `default` - 36px height
- `lg` - 40px height
- `icon` - Square icon button

**Usage**
```tsx
import { Button } from "@/components/ui/button"

<Button variant="pill" size="lg">
  Join Club
</Button>
```

## TypeScript Features

### Discriminated Unions

```typescript
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error }
```

**Benefit:** Invalid states unrepresentable. TypeScript forces exhaustive pattern matching.

### Branded Types

```typescript
type UserId = string & { readonly __userId: unique symbol }

function createUserId(id: string): UserId {
  return id as UserId
}
```

**Benefit:** Prevents mixing similar string types. Compiler catches misuse.

### Template Literal Types

```typescript
type ColorVariant = `brand-${Brand}-${"orange" | "blue"}`
// Result: "brand-Auburn-orange" | "brand-Auburn-blue"
```

**Benefit:** Type-safe Tailwind class generation.

## Rob Pike's Rules (Adapted for Frontend)

### Rule 1: Bottlenecks occur in unexpected places

**Frontend:** Performance issues are from:
- Main thread blocking
- Cascading re-renders
- Hydration mismatches

**Not:**
- Array methods on small datasets
- Simple algorithmic operations

**Practice:** Keep state local. Lift only as needed. Use Server Components.

### Rule 2: Measure before optimizing

**Tools:**
- React Profiler
- Chrome DevTools Flame Graph
- Lighthouse
- Core Web Vitals

**Anti-pattern:** Memoizing everything without measuring.

**Best:** Profile first, optimize measured bottlenecks.

### Rule 3: Fancy algorithms slow when n is small

**Frontend:** UI data is usually small (< 100 items).

**Anti-pattern:**
- Using fuzzy-search library for 12-item dropdown
- Complex state machine for simple toggle

**Best:** Native `.filter()`, `.sort()`, `.map()` are optimized by V8.

### Rule 4: Fancy algorithms are bloat when unused

**Frontend:** Avoid Swiss Army Knife components.

**Anti-pattern:** DataTable with 30 props when you need 3 rows.

**Best:** Composition over configuration. Small, focused primitives.

```tsx
<!-- Bad: Config-heavy -->
<DataTable sort filter export chart />

<!-- Good: Composed primitives -->
<DataTable.Root>
  <DataTable.Row>
    <DataTable.Cell />
  </DataTable.Row>
</DataTable.Root>
```

### Rule 5: Data dominates

**Frontend:** Component logic is function of state shape.

**Anti-pattern:**
```typescript
const [isLoading, setIsLoading] = useState(false)
const [isError, setIsError] = useState(false)
const [isSuccess, setIsSuccess] = useState(false)
```

**Best:**
```typescript
type State = { status: "idle" } | { status: "loading" } | { status: "success"; data: T } | { status: "error"; error: Error }
const [state, setState] = useState<State>({ status: "idle" })
```

**Practice:** Define state transitions first. UI logic disappears.

## React Best Practices

### Avoid useEffect

**Don't use for:**
- Data fetching (use React Query / Server Components)
- Derived state (calculate during render)
- Synchronizing React state (use event handlers)

**Use for:**
- External system sync (window listeners, Google Maps, WebSockets)

**Bad:**
```tsx
const [count, setCount] = useState(0)
useEffect(() => {
  if (count > 10) console.log("Threshold reached!")
}, [count])
```

**Good:**
```tsx
const handleIncrement = () => {
  const next = count + 1
  setCount(next)
  if (next > 10) console.log("Threshold reached!")
}
```

### Modern React Features

- **`use()`** - Consume promises/context conditionally
- **`useTransition`** - Prevent UI lock during mutations
- **`useOptimistic`** - Instant feedback on mutations
- **`useActionState`** - Server Action form state
- **Server Components** - Reduce client JS footprint

### Compound Components

```tsx
<Card>
  <Card.Header>
    <Card.Title>Meeting</Card.Title>
  </Card.Header>
  <Card.Content>...</Card.Content>
  <Card.Footer>
    <Button>RSVP</Button>
  </Card.Footer>
</Card>
```

## Tailwind CSS v4.1 Features

### CSS-First Config

```css
@import "tailwindcss";

@theme {
  --color-auburn-orange: oklch(0.694 0.202 42);
  --radius-pill: 9999px;
}
```

### Modern Color Spaces

```css
--color-primary: oklch(0.694 0.202 42); /* OKLCH */
--color-accent: color(display-p3 0.9 0.5 0.3); /* Display P3 */
```

### Container Queries

```html
<div class="@container">
  <div class="grid-cols-1 @sm:grid-cols-2">
    <!-- Changes based on parent, not viewport -->
  </div>
</div>
```

### Dark Mode

```css
@theme {
  --color-surface: light-dark(#ffffff, #001F4D);
}
```

## File Structure

```
lib/
├── design-tokens.ts    # Type definitions
├── design-helpers.ts   # Math helpers
├── motion.ts          # Motion constants
├── types.ts           # Advanced types
└── utils.ts          # Utility functions (cn, etc)

components/ui/          # Base UI primitives
└── ...               # Custom components

app/globals.css         # Tailwind v4 theme
```

## DX Guidelines

1. **Type-first:** Define types before components
2. **Data-first:** Define state shape before UI
3. **Composition:** Build from primitives
4. **Measurement:** Profile before optimizing
5. **Simplicity:** Native APIs over libraries

## Inspiration

- Apple HIG (motion, spacing)
- Rob Pike's 5 Rules (simplicity, data)
- Tailwind v4 (CSS-first, modern)
- React 19+ (Server Components, use hooks)
- TypeScript (type safety, advanced features)
