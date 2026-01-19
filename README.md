<div align="center">

# Web.Dev

**An interactive learning platform for web development**

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)

[Live Demo](https://web.dev.site) | [Documentation](docs/course-authoring-guide.md) | [Contributing](#contributing)

</div>

---

## What is this?

Web.Dev is an open-source educational platform featuring:

- **Interactive Code Playgrounds** - Full Node.js environment in the browser via WebContainers
- **Quizzes** - Multiple choice, fill-in-the-blank, and short answer with fuzzy matching
- **Progress Tracking** - Client-side progress persistence
- **MDX Content** - Write lessons in Markdown with React components

No backend required. Everything runs client-side or generates statically.

---

## Quick Start

### Prerequisites

- Node.js 18+
- [Bun](https://bun.sh/) (recommended) or npm/yarn/pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/dutch-casa/web.dev.site.git
cd web.dev.site

# Install dependencies
bun install

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
bun run build
bun run start
```

---

## Project Structure

```
web.dev.site/
├── app/                    # Next.js app router
│   └── modules/            # Course routes
├── content/
│   ├── courses/            # Course content (MDX)
│   └── exercises/          # Interactive exercises
├── components/
│   ├── mdx/                # Quiz, callout, exercise components
│   └── tutorial-kit/       # Code playground UI
├── lib/                    # Utilities, loaders, stores
└── docs/                   # Documentation
```

---

## Contributing Courses

Courses are file-based. No CMS, no database. Just files.

### Create a Course

```
content/courses/my-course/
├── course.json
├── 01-intro.mdx
├── 02-basics.mdx
└── 03-advanced.mdx
```

**course.json:**
```json
{
  "id": "my-course",
  "title": "My Course",
  "author": "Your Name",
  "description": "Course description",
  "modules": [
    {
      "title": "Getting Started",
      "lessons": ["01-intro", "02-basics", "03-advanced"]
    }
  ]
}
```

### Add Quizzes

```mdx
<MultipleChoice
  question="What is 2 + 2?"
  options={["3", "4", "5", "6"]}
  correct={1}
/>

<FillBlank
  question="The ___ keyword declares a constant."
  answer="const"
/>
```

### Add Exercises

```
content/exercises/my-exercise/
├── meta.yaml
├── src/App.tsx
└── solution/src/App.tsx
```

**meta.yaml:**
```yaml
title: Build Something
description: Practice what you learned
focus: /src/App.tsx
```

**Use in MDX:**
```mdx
<Exercise id="my-exercise" />
```

For the full guide, see **[Course Authoring Guide](docs/course-authoring-guide.md)**.

---

## Available Components

| Component | Purpose |
|-----------|---------|
| `<MultipleChoice>` | Single-answer quiz |
| `<FillBlank>` | Type-the-answer with fuzzy matching |
| `<ShortAnswer>` | Self-graded open response |
| `<Note>` `<Warning>` `<Tip>` | Callout boxes |
| `<Exercise>` | Interactive code playground |
| `<CodeSlides>` | Step-by-step code walkthrough |
| `<Video>` | YouTube embed |

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Editor | Monaco Editor |
| Runtime | WebContainers |
| Animation | Motion (Framer Motion) |
| State | Zustand |
| Syntax | Shiki |
| Testing | Vitest |

---

## Scripts

```bash
bun run dev          # Development server
bun run build        # Production build
bun run start        # Start production server
bun run lint         # Run ESLint
bun run test         # Run tests
bun run test:watch   # Watch mode
bun run test:ui      # Vitest UI
```

---

## Contributing

1. Fork the repository
2. Create a branch (`git checkout -b feature/amazing-course`)
3. Add your content to `content/courses/` or `content/exercises/`
4. Test locally (`bun run dev`)
5. Commit (`git commit -m 'Add amazing course'`)
6. Push (`git push origin feature/amazing-course`)
7. Open a Pull Request

See the [Course Authoring Guide](docs/course-authoring-guide.md) for detailed instructions.

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Star History

<a href="https://star-history.com/#dutch-casa/web.dev.site&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=dutch-casa/web.dev.site&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=dutch-casa/web.dev.site&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=dutch-casa/web.dev.site&type=Date" />
 </picture>
</a>
