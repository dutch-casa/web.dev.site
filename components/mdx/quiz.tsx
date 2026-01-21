"use client"

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useCallback,
} from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { fuzzyMatch } from "@/lib/fuzzy-match"
import { useControllableState, type Setter } from "@/lib/use-controllable-state"
import { Expand } from "@/lib/scale-in"
import {
  IconCheck,
  IconX,
  IconCircle,
  IconCircleCheck,
  IconQuestionMark,
} from "@tabler/icons-react"

type QuizState = "unanswered" | "correct" | "incorrect" | "override"

type QuizContextValue = {
  state: QuizState
  setState: Setter<QuizState>
}

const QuizContext = createContext<QuizContextValue | null>(null)

function useQuiz() {
  const ctx = useContext(QuizContext)
  if (!ctx) throw new Error("Quiz components must be used within Quiz.Root")
  return ctx
}

function Root({ children, state: propState, onStateChange }: { children: ReactNode; state?: QuizState; onStateChange?: (state: QuizState) => void }) {
  const [state, setState] = useControllableState<QuizState>({
    prop: propState,
    defaultProp: "unanswered",
    onChange: onStateChange,
  })

  return (
    <QuizContext.Provider value={{ state, setState }}>
      <motion.div
        className="my-6 rounded-2xl border border-muted-foreground/20 bg-muted/20 p-5"
      >
        {children}
      </motion.div>
    </QuizContext.Provider>
  )
}

function Question({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <IconQuestionMark className="mt-0.5 size-5 shrink-0 text-primary" />
      <p className="font-medium leading-relaxed">{children}</p>
    </div>
  )
}

function Feedback({ correctMessage, incorrectMessage }: { correctMessage?: string; incorrectMessage?: string }) {
  const { state } = useQuiz()

  if (state === "unanswered") return null

  const isCorrect = state === "correct" || state === "override"

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        className={cn(
          "mt-4 flex items-start gap-2.5 rounded-xl p-4",
          isCorrect ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
        )}
      >
        {isCorrect ? <IconCheck className="mt-0.5 size-4 shrink-0" /> : <IconX className="mt-0.5 size-4 shrink-0" />}
        <div className="text-sm">
          {isCorrect ? correctMessage ?? "Correct!" : incorrectMessage ?? "Not quite."}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function OverrideButton() {
  const { state, setState } = useQuiz()

  if (state !== "incorrect") return null

  return (
    <button
      type="button"
      onClick={() => setState("override")}
      className="mt-2 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
    >
      Actually, I was right
    </button>
  )
}

export const Quiz = { Root, Question, Feedback, OverrideButton }

type MultipleChoiceProps = {
  question: string
  options: string[]
  correct: number
  onStateChange?: (state: QuizState) => void
}

export function MultipleChoice({ question, options, correct, onStateChange }: MultipleChoiceProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [state, setState] = useControllableState<QuizState>({
    defaultProp: "unanswered",
    onChange: onStateChange,
  })

  const handleSelect = useCallback((index: number) => {
    if (state !== "unanswered") return
    const newState = index === correct ? "correct" : "incorrect"
    setSelected(index)
    setState(newState)
  }, [correct, state, setState])

  return (
    <Quiz.Root>
      <Quiz.Question>{question}</Quiz.Question>
      <div className="space-y-2">
        {options.map((option, i) => {
          const isSelected = selected === i
          const isCorrect = i === correct
          const showResult = state !== "unanswered"

          return (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(i)}
              disabled={state !== "unanswered"}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                state === "unanswered" && "border-muted-foreground/20 hover:border-primary hover:bg-primary/5",
                showResult && isSelected && isCorrect && "border-green-500 bg-green-500/10",
                showResult && isSelected && !isCorrect && "border-red-500 bg-red-500/10",
                showResult && !isSelected && isCorrect && "border-green-500/50 bg-green-500/5",
                showResult && !isSelected && !isCorrect && "border-muted-foreground/10 opacity-50"
              )}
            >
              {state === "unanswered" ? (
                <IconCircle className="size-4 shrink-0 text-muted-foreground" />
              ) : isCorrect ? (
                <IconCircleCheck className="size-4 shrink-0 text-green-500" />
              ) : isSelected ? (
                <IconX className="size-4 shrink-0 text-red-500" />
              ) : (
                <IconCircle className="size-4 shrink-0 text-muted-foreground/30" />
              )}
              <span>{option}</span>
            </button>
          )
        })}
      </div>
      <Expand show={state !== "unanswered"}>
        <div className={cn(
          "flex items-center gap-2.5 rounded-xl p-4 text-sm",
          state === "correct" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
        )}>
          {state === "correct" ? (
            <>
              <IconCheck className="size-4" />
              Correct!
            </>
          ) : (
            <>
              <IconX className="size-4" />
              Not quite. The correct answer is highlighted.
            </>
          )}
        </div>
      </Expand>
    </Quiz.Root>
  )
}

type FillBlankProps = {
  question: string
  answer: string
  fuzzyThreshold?: number
  onStateChange?: (state: QuizState) => void
}

export function FillBlank({ question, answer, fuzzyThreshold = 2, onStateChange }: FillBlankProps) {
  const [input, setInput] = useState("")
  const [isExactMatch, setIsExactMatch] = useState(false)
  const [state, setState] = useControllableState<QuizState>({
    defaultProp: "unanswered",
    onChange: onStateChange,
  })

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (state !== "unanswered" || !input.trim()) return
    const exact = input.trim().toLowerCase() === answer.trim().toLowerCase()
    const isCorrect = exact || fuzzyMatch(input, answer, fuzzyThreshold)
    setIsExactMatch(exact)
    setState(isCorrect ? "correct" : "incorrect")
  }, [input, answer, fuzzyThreshold, state, setState])

  const handleOverride = useCallback(() => setState("override"), [setState])

  const parts = question.split("___")

  return (
    <Quiz.Root>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-wrap items-center gap-1.5">
          <IconQuestionMark className="mr-1 size-5 shrink-0 text-primary" />
          {parts.map((part, i) => (
            <span key={i} className="font-medium leading-relaxed">
              {part}
              {i < parts.length - 1 && (
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={state !== "unanswered"}
                  placeholder="..."
                  className={cn(
                    "mx-1.5 inline-block w-28 rounded-lg border-b-2 bg-transparent px-3 py-1 text-center text-sm outline-none transition-colors",
                    state === "unanswered" && "border-muted-foreground/30 focus:border-primary",
                    state === "correct" && "border-green-500 text-green-600",
                    state === "override" && "border-green-500 text-green-600",
                    state === "incorrect" && "border-red-500 text-red-600"
                  )}
                />
              )}
            </span>
          ))}
        </div>
        {state === "unanswered" && (
          <button
            type="submit"
            disabled={!input.trim()}
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            Check Answer
          </button>
        )}
      </form>
      <Expand show={state !== "unanswered"}>
        <div className={cn(
          "flex items-start gap-2.5 rounded-xl p-4 text-sm",
          state === "correct" || state === "override" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
        )}>
          {(state === "correct" || state === "override") ? (
            <>
              <IconCheck className="mt-0.5 size-4 shrink-0" />
              {isExactMatch || state === "override" ? (
                <span>Correct!</span>
              ) : (
                <div>
                  <span>Close enough!</span>
                  <span className="mt-1.5 block text-muted-foreground">
                    Answer: <code className="rounded-lg bg-muted px-2 py-0.5">{answer}</code>
                  </span>
                </div>
              )}
            </>
          ) : (
            <>
              <IconX className="mt-0.5 size-4 shrink-0" />
              <div>
                <span>Not quite.</span>
                <span className="mt-1.5 block text-muted-foreground">
                  Expected: <code className="rounded-lg bg-muted px-2 py-0.5">{answer}</code>
                </span>
              </div>
            </>
          )}
        </div>
      </Expand>
      <Expand show={state === "incorrect"}>
        <button type="button" onClick={handleOverride} className="pt-2 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
          Actually, I was right
        </button>
      </Expand>
    </Quiz.Root>
  )
}

type ShortAnswerProps = {
  question: string
  hint?: string
  answer: string
  onStateChange?: (state: QuizState) => void
}

export function ShortAnswer({ question, hint, answer, onStateChange }: ShortAnswerProps) {
  const [input, setInput] = useState("")
  const [revealed, setRevealed] = useState(false)
  const [state, setState] = useControllableState<QuizState>({
    defaultProp: "unanswered",
    onChange: onStateChange,
  })

  const handleCorrect = useCallback(() => setState("correct"), [setState])
  const handleIncorrect = useCallback(() => setState("incorrect"), [setState])
  const handleSubmit = useCallback(() => {
    if (input.trim() && state === "unanswered") {
      setState("incorrect")
    }
  }, [input, state, setState])

  const hasContent = input.trim().length > 0

  return (
    <Quiz.Root>
      <Quiz.Question>{question}</Quiz.Question>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={state !== "unanswered"}
        placeholder="Type your answer..."
        className={cn(
          "w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none transition-colors resize-none min-h-[84px]",
          state === "unanswered" && "border-muted-foreground/30 focus:border-primary",
          state === "correct" && "border-green-500",
          state === "incorrect" && "border-red-500"
        )}
      />

      <Expand show={state === "unanswered" && hasContent}>
        <div className="pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Submit
          </button>
        </div>
      </Expand>

      <Expand show={state === "incorrect"}>
        <div className="space-y-4 pt-4">
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
            <p className="text-xs font-medium text-primary/70 uppercase tracking-wide mb-2">Expected Answer</p>
            <p className="text-sm leading-relaxed">{answer}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">How did you do?</span>
            <button
              type="button"
              onClick={handleCorrect}
              className="rounded-full bg-green-600/90 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
            >
              I got it right
            </button>
            <button
              type="button"
              onClick={handleIncorrect}
              className="rounded-full bg-red-600/90 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              I got it wrong
            </button>
          </div>
        </div>
      </Expand>

      <Expand show={state === "correct"}>
        <div className="flex items-center gap-2.5 rounded-xl bg-green-500/10 p-4 text-sm text-green-600 pt-4">
          <IconCheck className="size-4" />
          <span>Nice work!</span>
        </div>
      </Expand>

        {hint && state === "unanswered" && (
          <div className="mt-3">
            {revealed ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-muted-foreground"
              >
                <span className="font-medium">Hint:</span> {hint}
              </motion.p>
            ) : (
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Show hint
              </button>
            )}
          </div>
        )}
      </Quiz.Root>
    )
}
