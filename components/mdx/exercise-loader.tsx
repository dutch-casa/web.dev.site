/**
 * Exercise - Server component that loads exercise from filesystem
 *
 * Usage in MDX:
 *   <Exercise id="counter-exercise" />
 *   <Exercise id="counter-exercise" defaultExpanded height={700} />
 */

import { loadExercise } from "@/lib/tutorial-kit/load-exercise"
import { ExerciseClient } from "./exercise-client"

interface ExerciseProps {
  /** Exercise ID (matches directory name in content/exercises/) */
  id: string
  /** Start expanded (default: false) */
  defaultExpanded?: boolean
  /** Height of expanded workspace (default: 600) */
  height?: number
  /** Additional className */
  className?: string
}

export async function Exercise({
  id,
  defaultExpanded = false,
  height = 600,
  className,
}: ExerciseProps) {
  const config = await loadExercise(id)

  return (
    <ExerciseClient
      config={config}
      defaultExpanded={defaultExpanded}
      height={height}
      className={className}
    />
  )
}
