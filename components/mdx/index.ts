// Compound components for full customization
export { Callout, Note, Warning, Tip } from "./callouts"
export { Starter, StarterCode } from "./starter-code"
export { CodeSlides, CodeSlidesSimple } from "./code-slides"
export { Video, YouTubeVideo } from "./video"
export { Quiz, MultipleChoice, FillBlank, ShortAnswer } from "./quiz"

// Exercises
// - Exercise: File-based (loads from content/exercises/{id}/) - PREFERRED
// - ExerciseInline: Compound component API for custom layouts
// - ExerciseBlock: Legacy MDX-friendly with inline files array
export { Exercise } from "./exercise-loader"
export { Exercise as ExerciseInline, SimpleExercise, ExerciseBlock } from "./exercise"