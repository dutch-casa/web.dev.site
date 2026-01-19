"use client"

import { motion, LayoutGroup, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"

type Tag = {
  id: string
  label: string
}

type TagFilterProps = {
  tags: Tag[]
  selected: string[]
  onToggle: (tagId: string) => void
  onClear: () => void
}

export function TagFilter({ tags, selected, onToggle, onClear }: TagFilterProps) {
  const hasSelection = selected.length > 0

  return (
    <LayoutGroup>
      <motion.div
        layout
        className="flex flex-wrap gap-2"
      >
        <motion.button
          layout
          onClick={onClear}
          className={cn(
            "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
            !hasSelection
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          {!hasSelection && (
            <motion.span
              layoutId="tag-highlight"
              className="absolute inset-0 rounded-full bg-foreground"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">All</span>
        </motion.button>

        {tags.map((tag) => {
          const isSelected = selected.includes(tag.id)

          return (
            <motion.button
              layout
              key={tag.id}
              onClick={() => onToggle(tag.id)}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isSelected
                  ? "text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <AnimatePresence>
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="absolute inset-0 rounded-full bg-foreground"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </AnimatePresence>
              <span className="relative z-10">{tag.label}</span>
            </motion.button>
          )
        })}
      </motion.div>
    </LayoutGroup>
  )
}
