"use client"

/**
 * ExerciseClient - Client component that renders the TutorialKit
 *
 * Receives pre-loaded config from server component (Exercise).
 * This separation allows filesystem access in server component
 * while keeping interactivity in client component.
 */

import { TutorialKit, FilePane, EditorPane, OutputPane } from "@/components/tutorial-kit"
import type { ExerciseConfig } from "@/lib/tutorial-kit/types"

interface ExerciseClientProps {
  config: ExerciseConfig
  defaultExpanded?: boolean
  height?: number
  className?: string
}

export function ExerciseClient({
  config,
  defaultExpanded = false,
  height = 600,
  className,
}: ExerciseClientProps) {
  return (
    <TutorialKit.Root config={config} defaultExpanded={defaultExpanded} className={className}>
      <TutorialKit.Collapsed />
      <TutorialKit.Expanded height={height}>
        <TutorialKit.Toolbar />
        <TutorialKit.Workspace>
          <FilePane />
          <EditorPane />
          <OutputPane />
        </TutorialKit.Workspace>
      </TutorialKit.Expanded>
    </TutorialKit.Root>
  )
}
