# Course Authoring Guide

A comprehensive guide to creating courses, quizzes, and interactive code playgrounds on this platform.

## Overview

This platform uses a **file-based content system** with no CMS or admin interface. Content is authored in MDX (Markdown + JSX) and stored directly in the filesystem. Changes are version-controlled via Git.

**Key technologies:**
- **MDX** - Markdown with embedded React components
- **WebContainers** - Browser-based Node.js for interactive playgrounds
- **Shiki** - Syntax highlighting
- **Zustand** - Client-side progress tracking

---

## Quick Start

### 1. Create a Course

```
content/courses/my-course/
├── course.json          # Course metadata
├── 01-getting-started.mdx
├── 02-fundamentals.mdx
└── 03-advanced.mdx
```

### 2. Create an Exercise

```
content/exercises/my-exercise/
├── meta.yaml            # Exercise config
├── src/
│   └── App.tsx          # Starter code
└── solution/            # Optional
    └── src/
        └── App.tsx
```

### 3. Build and Preview

```bash
bun run dev     # Development server
bun run build   # Production build
```

---

## Part 1: Course Structure

### Directory Layout

```
content/courses/{course-id}/
├── course.json              # Required: metadata
├── 01-lesson-slug.mdx       # Lesson files
├── 02-another-lesson.mdx
└── ...
```

### course.json

Defines course metadata and structure:

```json
{
  "id": "react-fundamentals",
  "title": "React Fundamentals",
  "author": "Your Name",
  "description": "Learn React from scratch with hands-on exercises.",
  "modules": [
    {
      "title": "Getting Started",
      "lessons": ["01-intro", "02-setup", "03-components"]
    },
    {
      "title": "State & Props",
      "lessons": ["04-props", "05-state", "06-events"]
    },
    {
      "title": "Advanced",
      "lessons": ["07-hooks", "08-context", "09-patterns"]
    }
  ]
}
```

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (matches directory name) |
| `title` | string | Display title |
| `author` | string | Course author name |
| `description` | string | Short description for course cards |
| `modules` | array | Grouped lessons |
| `modules[].title` | string | Module heading |
| `modules[].lessons` | string[] | Lesson IDs (without `.mdx`) |

### Lesson Files

Lessons are MDX files with numeric prefixes for ordering:

```
01-intro.mdx         → "Intro"
02-getting-started.mdx → "Getting Started"
03-first-component.mdx → "First Component"
```

The numeric prefix determines order; the slug becomes the URL and is auto-formatted for display:
- `01-intro` → `/modules/react-fundamentals/01-intro` → displays as "Intro"

### Basic Lesson Structure

```mdx
# Lesson Title

Introduction paragraph explaining what this lesson covers.

## First Section

Content goes here. You can use all standard Markdown:

- Bullet points
- **Bold text**
- `inline code`

### Code Examples

\`\`\`typescript
function example() {
  return "Hello, world!"
}
\`\`\`

## Second Section

More content...
```

---

## Part 2: Quiz Components

Three quiz types are available, each with different use cases.

### Multiple Choice

Best for: Testing factual knowledge with clear correct answers.

```mdx
<MultipleChoice
  question="What hook is used for side effects in React?"
  options={[
    "useEffect",
    "useState",
    "useMemo",
    "useCallback"
  ]}
  correct={0}
/>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `question` | string | The question text |
| `options` | string[] | Array of answer choices |
| `correct` | number | Zero-based index of correct answer |
| `onStateChange` | function | Optional callback when state changes |

**Behavior:**
- Single selection only
- Green border on correct, red on incorrect
- Shows correct answer after submission
- Cannot change answer once submitted

### Fill in the Blank

Best for: Testing recall of specific terms or concepts.

```mdx
<FillBlank
  question="The ___ hook allows you to access context values."
  answer="useContext"
  fuzzyThreshold={2}
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `question` | string | - | Use `___` for the blank |
| `answer` | string | - | Expected answer |
| `fuzzyThreshold` | number | 2 | Levenshtein distance (typo tolerance) |
| `onStateChange` | function | - | Optional callback |

**Fuzzy Matching:**
- `fuzzyThreshold={0}` - Exact match required
- `fuzzyThreshold={1}` - 1 character difference allowed
- `fuzzyThreshold={2}` - 2 character differences allowed (recommended)

Example: With threshold 2, "usContext" or "useContextt" would match "useContext".

**Features:**
- "Actually, I was right" override button for edge cases
- Shows expected answer when incorrect

### Short Answer

Best for: Open-ended questions requiring explanation.

```mdx
<ShortAnswer
  question="Explain the difference between props and state."
  answer="Props are passed from parent to child and are read-only. State is managed within the component and can be updated."
  hint="Think about who controls each one."
/>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `question` | string | The question text |
| `answer` | string | Expected answer (shown after submission) |
| `hint` | string | Optional hint (revealed on click) |
| `onStateChange` | function | Optional callback |

**Behavior:**
1. User types answer in textarea
2. Clicks "Submit"
3. Expected answer is revealed
4. User self-grades: "I got it right" / "I got it wrong"

**When to use:**
- Conceptual questions with multiple valid phrasings
- Questions requiring explanation or reasoning
- Practice for interview-style questions

### Quiz Design Tips

1. **Place quizzes after teaching content** - Test what was just explained
2. **Use multiple choice for facts** - "Which method does X?"
3. **Use fill-blank for terminology** - "The ___ pattern..."
4. **Use short answer for concepts** - "Why is X important?"
5. **Set appropriate fuzzy thresholds** - Lower for technical terms, higher for concepts

---

## Part 3: Callout Components

Three callout styles for highlighting important information.

### Note

For supplementary information:

```mdx
<Note>
All code examples in this course use TypeScript. If you prefer JavaScript,
you can remove the type annotations.
</Note>
```

### Warning

For important cautions:

```mdx
<Warning>
Never store API keys in client-side code. They will be visible to anyone
who inspects your bundle.
</Warning>
```

### Tip

For helpful suggestions:

```mdx
<Tip>
Use keyboard shortcuts in the playground: Cmd/Ctrl+S to save, Cmd/Ctrl+Enter to run.
</Tip>
```

---

## Part 4: Interactive Code Playgrounds

The playground runs a complete Node.js environment in the browser using WebContainers. Users can edit code, see real-time previews, and experiment freely.

### Method 1: File-Based (Recommended)

Create exercises as standalone directories:

```
content/exercises/counter-exercise/
├── meta.yaml
├── src/
│   └── App.tsx
└── solution/
    └── src/
        └── App.tsx
```

**meta.yaml:**

```yaml
title: Build a Counter
description: Learn useState by implementing increment and decrement
focus: /src/App.tsx
```

**src/App.tsx (starter code):**

```tsx
import { useState } from 'react'

export default function App() {
  // TODO: Replace with useState
  const count = 0

  function increment() {
    // TODO: Implement
  }

  function decrement() {
    // TODO: Implement
  }

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </div>
  )
}
```

**solution/src/App.tsx:**

```tsx
import { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)

  function increment() {
    setCount(count + 1)
  }

  function decrement() {
    setCount(count - 1)
  }

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </div>
  )
}
```

**Use in MDX:**

```mdx
## Try It Yourself

Build a counter component using useState:

<Exercise id="counter-exercise" />
```

**Exercise Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | string | - | Matches directory name |
| `defaultExpanded` | boolean | false | Start expanded |
| `height` | number | 600 | Expanded height in pixels |

### meta.yaml Reference

```yaml
title: Exercise Title
description: Brief description shown in collapsed state
focus: /src/App.tsx           # File to open initially
dependencies:                  # NPM dependencies (optional)
  axios: ^1.0.0
  zustand: ^4.0.0
devDependencies:              # Dev dependencies (optional)
  typescript: ^5.0.0
scripts:                       # Custom scripts (optional)
  test: vitest
devCommand: npm run dev       # Start command (default)
previewPort: 5173             # Vite port (default)
```

### Method 2: Inline with ExerciseBlock

For simple exercises that don't need separate files:

```mdx
<ExerciseBlock
  id="quick-demo"
  title="Quick Demo"
  description="A simple inline exercise"
  focus="/src/App.tsx"
  files={[
    {
      path: "/src/App.tsx",
      content: `export default function App() {
  return <h1>Edit me!</h1>
}`
    }
  ]}
  solution={[
    {
      path: "/src/App.tsx",
      content: `export default function App() {
  return <h1>Hello, World!</h1>
}`
    }
  ]}
/>
```

### Method 3: SimpleExercise

For the simplest case (just App.tsx):

```mdx
<SimpleExercise
  id="hello-world"
  title="Hello World"
  description="Your first React component"
  code={`export default function App() {
  return <h1>Hello, World!</h1>
}`}
/>
```

### Scaffold Files

Every exercise automatically includes hidden scaffold files:

- `/package.json` - React + Vite dependencies
- `/vite.config.js` - Vite configuration
- `/index.html` - HTML entry point
- `/src/main.tsx` - React root mount

You don't need to include these unless you want to customize them.

### File Visibility

Control what users see and can edit:

```yaml
# In file definitions
hidden: true     # Hide from file tree (scaffold files)
readonly: true   # Visible but not editable
```

Use cases:
- **Hidden:** Config files users shouldn't touch
- **Readonly:** Reference files users should see but not modify

### Adding Dependencies

For exercises needing additional packages:

**meta.yaml:**

```yaml
title: Data Fetching Exercise
description: Practice with React Query
focus: /src/App.tsx
dependencies:
  "@tanstack/react-query": "^5.0.0"
  axios: "^1.6.0"
```

Or in ExerciseBlock:

```mdx
<ExerciseBlock
  id="data-fetching"
  title="Data Fetching"
  dependencies={{
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.6.0"
  }}
  files={[...]}
/>
```

### Multi-File Exercises

For more complex exercises with multiple files:

```
content/exercises/todo-app/
├── meta.yaml
├── src/
│   ├── App.tsx
│   ├── components/
│   │   ├── TodoList.tsx
│   │   ├── TodoItem.tsx
│   │   └── AddTodo.tsx
│   └── hooks/
│       └── useTodos.ts
└── solution/
    └── src/
        └── ...
```

All files in `src/` are automatically included and visible.

### Playground UX Features

The playground provides:

- **Monaco Editor** - VS Code editing experience
- **File Tree** - Navigate between files
- **Terminal** - See npm output, errors
- **Live Preview** - Hot-reload on save
- **Fullscreen Mode** - Expand for focused work
- **Run/Stop/Reset** - Control the dev server

---

## Part 5: Code Examples

### Syntax Highlighting

Standard fenced code blocks with language annotation:

```mdx
\`\`\`typescript
const greeting: string = "Hello"
\`\`\`
```

Supported languages include: TypeScript, JavaScript, Python, Go, Rust, CSS, HTML, JSON, YAML, Bash, and many more.

### Code Slides

Show step-by-step transformations:

```mdx
<CodeSlides>
\`\`\`typescript
// Step 1: Define the type
type User = {
  id: string
  name: string
}
\`\`\`

\`\`\`typescript
// Step 2: Add a function
function greetUser(user: User) {
  return `Hello, ${user.name}!`
}
\`\`\`

\`\`\`typescript
// Step 3: Use it
const user: User = { id: "1", name: "Dev" }
console.log(greetUser(user))
\`\`\`
</CodeSlides>
```

Users can navigate between slides with arrows or swipe on mobile.

### Starter Code Links

Link to external repositories:

```mdx
<StarterCode
  href="https://github.com/your-org/starter-template"
  label="Download Starter"
/>
```

---

## Part 6: Video Content

Embed YouTube videos:

```mdx
<Video id="dQw4w9WgXcQ" title="Introduction to React" />
```

---

## Part 7: Progress Tracking

Progress is tracked client-side in localStorage. No backend required.

### How It Works

- Each lesson can be marked complete/incomplete
- Progress persists in browser localStorage
- Course cards show progress percentage
- Checkmarks appear next to completed lessons

### Independence from Quizzes

**Important:** Quiz completion does NOT affect lesson progress.

- Quizzes are for self-assessment only
- Quiz state is ephemeral (resets on page refresh)
- Users mark lessons complete manually
- This is intentional - it respects user judgment

---

## Part 8: Complete Course Example

Here's a full course structure:

### Directory Structure

```
content/courses/react-hooks/
├── course.json
├── 01-intro.mdx
├── 02-useState.mdx
├── 03-useEffect.mdx
├── 04-custom-hooks.mdx
└── 05-practice.mdx

content/exercises/
├── counter-exercise/
│   ├── meta.yaml
│   ├── src/App.tsx
│   └── solution/src/App.tsx
├── timer-exercise/
│   ├── meta.yaml
│   ├── src/App.tsx
│   └── solution/src/App.tsx
└── custom-hook-exercise/
    ├── meta.yaml
    ├── src/
    │   ├── App.tsx
    │   └── hooks/useCounter.ts
    └── solution/src/
        ├── App.tsx
        └── hooks/useCounter.ts
```

### course.json

```json
{
  "id": "react-hooks",
  "title": "React Hooks Mastery",
  "author": "Web.Dev Team",
  "description": "Master React Hooks from useState to custom hooks with hands-on exercises.",
  "modules": [
    {
      "title": "Foundations",
      "lessons": ["01-intro", "02-useState"]
    },
    {
      "title": "Side Effects",
      "lessons": ["03-useEffect"]
    },
    {
      "title": "Advanced",
      "lessons": ["04-custom-hooks", "05-practice"]
    }
  ]
}
```

### 02-useState.mdx

```mdx
# Understanding useState

The `useState` hook lets you add state to functional components.

## The Basics

\`\`\`typescript
const [count, setCount] = useState(0)
\`\`\`

<Note>
The array destructuring syntax `[value, setValue]` is a convention.
You can name these whatever you want.
</Note>

## How It Works

<CodeSlides>
\`\`\`typescript
// 1. Import the hook
import { useState } from 'react'
\`\`\`

\`\`\`typescript
// 2. Call it in your component
function Counter() {
  const [count, setCount] = useState(0)
}
\`\`\`

\`\`\`typescript
// 3. Use the state and updater
function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
\`\`\`
</CodeSlides>

## Check Your Understanding

<MultipleChoice
  question="What does useState return?"
  options={[
    "An array with [currentValue, updateFunction]",
    "Just the current value",
    "An object with value and setValue",
    "A single update function"
  ]}
  correct={0}
/>

<FillBlank
  question="To update state, you call the ___ function."
  answer="setter"
  fuzzyThreshold={2}
/>

## Try It Yourself

Build a counter component from scratch:

<Exercise id="counter-exercise" />

<Tip>
Remember: calling the setter function triggers a re-render with the new value.
</Tip>

## Common Mistakes

<Warning>
Never mutate state directly! Always use the setter function.

\`\`\`typescript
// Wrong
count = count + 1

// Right
setCount(count + 1)
\`\`\`
</Warning>

## Summary

<ShortAnswer
  question="Why can't you mutate state directly in React?"
  answer="React needs to know when state changes to trigger a re-render. Mutating directly bypasses React's state tracking, so the UI won't update."
  hint="Think about how React knows when to update the DOM."
/>
```

---

## Part 9: Best Practices

### Course Design

1. **Start simple** - First lessons should be accessible
2. **Build progressively** - Each lesson builds on the last
3. **Alternate theory and practice** - Don't have too many concepts before an exercise
4. **Keep lessons focused** - One main concept per lesson
5. **End with application** - Final lessons should integrate everything

### Quiz Design

1. **Test understanding, not memory** - Avoid gotcha questions
2. **Make wrong answers plausible** - Easy to eliminate options don't help
3. **Use quizzes to reinforce** - Quiz on what you just taught
4. **Provide context in feedback** - Explain why answers are correct/incorrect

### Exercise Design

1. **Clear starting point** - Starter code should compile/run
2. **Focused scope** - One concept per exercise
3. **Achievable goals** - Don't make users struggle unnecessarily
4. **Include solution** - Let stuck users see the answer
5. **Use TODO comments** - Guide users to what needs changing

### Content Writing

1. **Lead with why** - Explain motivation before mechanics
2. **Use concrete examples** - Abstract concepts need illustration
3. **Break up walls of text** - Use headings, lists, code blocks
4. **Link between lessons** - Reference related content
5. **End with summary** - Reinforce key takeaways

---

## Routes Reference

| URL | Content |
|-----|---------|
| `/modules` | Course listing page |
| `/modules/{course-id}` | Course overview with lesson list |
| `/modules/{course-id}/{lesson-id}` | Individual lesson |

---

## Troubleshooting

### Exercise won't load

1. Check `meta.yaml` syntax (YAML is whitespace-sensitive)
2. Verify exercise ID matches directory name
3. Check for JavaScript syntax errors in starter files
4. Look at browser console for errors

### Quiz not working

1. Ensure `correct` index is valid (zero-based)
2. Check that `___` placeholder exists for FillBlank
3. Verify component imports in MDX

### Course not appearing

1. Verify `course.json` has valid JSON syntax
2. Check that lesson IDs match actual `.mdx` files
3. Rebuild the site (`bun run build`)

### Preview not loading

WebContainer issues:
1. Check browser console for errors
2. Ensure you're using a supported browser (Chrome, Edge, Firefox)
3. Clear browser cache/storage
4. Check that `package.json` dependencies are valid

---

## MDX Component Reference

### Quizzes
- `<MultipleChoice question options correct />`
- `<FillBlank question answer fuzzyThreshold />`
- `<ShortAnswer question answer hint />`

### Callouts
- `<Note>content</Note>`
- `<Warning>content</Warning>`
- `<Tip>content</Tip>`

### Exercises
- `<Exercise id />` (file-based)
- `<ExerciseBlock id title files />` (inline)
- `<SimpleExercise id title code />` (minimal)

### Code
- `<CodeSlides>...</CodeSlides>` (step-by-step)
- `<StarterCode href label />` (download link)

### Media
- `<Video id title />` (YouTube)

---

## Next Steps

1. **Create your first course** - Start with the Quick Start section
2. **Build exercises** - Practice with file-based exercises
3. **Test thoroughly** - Preview in development mode
4. **Iterate on feedback** - Improve based on learner experience
