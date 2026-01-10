"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

// Progress state shape - Record of courseId to Set of completed lessonIds
// Using array in storage since JSON can't serialize Set
type ProgressState = {
  completed: Record<string, string[]>
}

type ProgressActions = {
  markComplete: (courseId: string, lessonId: string) => void
  markIncomplete: (courseId: string, lessonId: string) => void
  isComplete: (courseId: string, lessonId: string) => boolean
  getCompletedLessons: (courseId: string) => readonly string[]
  getCourseProgress: (courseId: string, totalLessons: number) => number
  reset: () => void
}

type ProgressStore = ProgressState & ProgressActions

const initialState: ProgressState = {
  completed: {},
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      markComplete: (courseId, lessonId) =>
        set((state) => {
          const current = state.completed[courseId] ?? []
          if (current.includes(lessonId)) return state

          return {
            completed: {
              ...state.completed,
              [courseId]: [...current, lessonId],
            },
          }
        }),

      markIncomplete: (courseId, lessonId) =>
        set((state) => {
          const current = state.completed[courseId] ?? []
          if (!current.includes(lessonId)) return state

          return {
            completed: {
              ...state.completed,
              [courseId]: current.filter((id) => id !== lessonId),
            },
          }
        }),

      isComplete: (courseId, lessonId) => {
        const current = get().completed[courseId] ?? []
        return current.includes(lessonId)
      },

      getCompletedLessons: (courseId) => {
        return get().completed[courseId] ?? []
      },

      getCourseProgress: (courseId, totalLessons) => {
        if (totalLessons === 0) return 0
        const completed = get().completed[courseId]?.length ?? 0
        return completed / totalLessons
      },

      reset: () => set(initialState),
    }),
    {
      name: "course-progress",
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// Selector hooks for optimized re-renders
export const useIsLessonComplete = (courseId: string, lessonId: string) =>
  useProgressStore((state) => (state.completed[courseId] ?? []).includes(lessonId))

export const useCourseProgress = (courseId: string, totalLessons: number) =>
  useProgressStore((state) => {
    if (totalLessons === 0) return 0
    const completed = state.completed[courseId]?.length ?? 0
    return completed / totalLessons
  })
