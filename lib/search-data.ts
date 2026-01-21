import { getAllCourses } from "./course-loader";
import { flattenLessons } from "./course-types";
import vaultData from "@/content/vault/vault.json";
import vaultCache from "@/content/vault/vault-cache.json";

// ============================================================================
// TYPES
// ============================================================================

export type SearchCourse = {
  id: string;
  title: string;
  description: string;
  slug: string;
};

export type SearchLesson = {
  id: string;
  title: string;
  courseTitle: string;
  courseSlug: string;
  lessonSlug: string;
};

export type SearchVaultItem = {
  id: string;
  title: string;
  url: string;
  tags: string[];
};

export type SearchData = {
  courses: SearchCourse[];
  lessons: SearchLesson[];
  vaultItems: SearchVaultItem[];
};

// ============================================================================
// AGGREGATION
// ============================================================================

export async function getSearchData(): Promise<SearchData> {
  const courses = await getAllCourses();

  // Transform courses for search
  const searchCourses: SearchCourse[] = courses.map((course) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    slug: course.id, // Using ID as slug
  }));

  // Transform lessons for search
  const searchLessons: SearchLesson[] = [];

  for (const course of courses) {
    const lessons = flattenLessons(course);
    for (const lesson of lessons) {
      searchLessons.push({
        id: `${course.id}-${lesson.lessonId}`,
        title: lesson.title,
        courseTitle: course.title,
        courseSlug: course.id,
        lessonSlug: lesson.lessonId,
      });
    }
  }

  // Transform vault items for search
  const cache = vaultCache as Record<string, { title?: string }>;
  const searchVaultItems: SearchVaultItem[] = vaultData.resources
    .map((resource, index) => {
      const cached = cache[resource.url];
      return {
        id: `vault-${index}`,
        title: cached?.title || resource.url,
        url: resource.url,
        tags: resource.tags,
      };
    })
    .filter((item) => item.title); // Only include items with titles

  return {
    courses: searchCourses,
    lessons: searchLessons,
    vaultItems: searchVaultItems,
  };
}
