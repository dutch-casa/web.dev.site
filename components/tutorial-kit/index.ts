// TutorialKit - Interactive coding tutorial component system
// Compound component pattern with WebContainer integration

export { TutorialKit } from "./TutorialKit"
export { FilePane } from "./FilePane"
export { EditorPane } from "./EditorPane"
export { OutputPane } from "./OutputPane"

// Re-export types for convenience
export type {
  ExerciseConfig,
  ExerciseFile,
  FileContent,
  BootState,
  ServerState,
  TutorialState,
} from "@/lib/tutorial-kit/types"

// Re-export hooks for advanced usage
export {
  TutorialProvider,
  useTutorial,
  useTutorialConfig,
  useTutorialFiles,
  useTutorialBootState,
  useTutorialServerState,
  useTutorialEditor,
  useTutorialTerminal,
  useTutorialPanels,
  useTutorialExpanded,
  useTutorialActions,
  useTutorialIsLoading,
  useTutorialIsReady,
  useTutorialError,
  useTutorialPreviewUrl,
  useTutorialActiveFile,
  useTutorialActiveFileContent,
  useTutorialFilePaths,
} from "@/lib/tutorial-kit/context"
