import fs from "node:fs/promises"
import path from "node:path"
import type { Course } from "./course-types"

const CONTENT_DIR = path.join(process.cwd(), "content", "courses")

export async function getAllCourses(): Promise<Course[]> {
  const entries = await fs.readdir(CONTENT_DIR, { withFileTypes: true })
  const courseDirs = entries.filter((e) => e.isDirectory())

  const courses = await Promise.all(
    courseDirs.map(async (dir) => {
      const coursePath = path.join(CONTENT_DIR, dir.name, "course.json")
      const content = await fs.readFile(coursePath, "utf-8")
      return JSON.parse(content) as Course
    })
  )

  return courses
}

export async function getCourse(courseId: string): Promise<Course | null> {
  try {
    const coursePath = path.join(CONTENT_DIR, courseId, "course.json")
    const content = await fs.readFile(coursePath, "utf-8")
    return JSON.parse(content) as Course
  } catch {
    return null
  }
}

export async function getLessonContent(
  courseId: string,
  lessonId: string
): Promise<{ default: React.ComponentType } | null> {
  try {
    // Dynamic import for MDX files
    const mod = await import(`@/content/courses/${courseId}/${lessonId}.mdx`)
    return mod
  } catch {
    return null
  }
}

export async function getAllLessonPaths(): Promise<
  Array<{ course: string; lesson: string }>
> {
  const courses = await getAllCourses()
  const paths: Array<{ course: string; lesson: string }> = []

  for (const course of courses) {
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        paths.push({ course: course.id, lesson })
      }
    }
  }

  return paths
}
