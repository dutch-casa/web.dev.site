"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import {
  IconSearch,
  IconBook,
  IconFileText,
  IconLibrary,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

// ============================================================================
// CONTEXT
// ============================================================================

interface CommandMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CommandMenuContext = React.createContext<CommandMenuContextValue | null>(
  null
);

export function useCommandMenu() {
  const context = React.useContext(CommandMenuContext);
  if (!context) {
    throw new Error(
      "CommandMenu compound components must be used within CommandMenu.Root"
    );
  }
  return context;
}

// ============================================================================
// ROOT
// ============================================================================

interface CommandMenuRootProps {
  children: React.ReactNode;
}

function CommandMenuRoot({ children }: CommandMenuRootProps) {
  const [open, setOpen] = React.useState(false);

  // Global keyboard shortcut
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandMenuContext.Provider value={{ open, setOpen }}>
      {children}
    </CommandMenuContext.Provider>
  );
}

// ============================================================================
// TRIGGER BUTTON
// ============================================================================

interface CommandMenuTriggerProps {
  className?: string;
}

function CommandMenuTrigger({ className }: CommandMenuTriggerProps) {
  const { setOpen } = useCommandMenu();

  return (
    <motion.button
      onClick={() => setOpen(true)}
      className={`group flex items-center gap-3 px-4 py-2.5 rounded-lg border border-border/50 bg-background/50 backdrop-blur-sm hover:bg-accent/50 hover:border-border transition-all duration-200 ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <IconSearch className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
        Search...
      </span>
      <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border/50 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 group-hover:opacity-100 transition-opacity">
        <span className="text-xs">⌘</span>K
      </kbd>
    </motion.button>
  );
}

// ============================================================================
// DIALOG
// ============================================================================

interface CommandMenuDialogProps {
  courses: Array<{
    id: string;
    title: string;
    description: string;
    slug: string;
  }>;
  lessons: Array<{
    id: string;
    title: string;
    courseTitle: string;
    courseSlug: string;
    lessonSlug: string;
  }>;
  vaultItems: Array<{
    id: string;
    title: string;
    url: string;
    tags: string[];
  }>;
}

function CommandMenuDialog({
  courses,
  lessons,
  vaultItems,
}: CommandMenuDialogProps) {
  const { open, setOpen } = useCommandMenu();
  const router = useRouter();
  const [search, setSearch] = React.useState("");

  // Close on escape
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  // Reset search when closing
  React.useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  const handleSelect = React.useCallback(
    (callback: () => void) => {
      setOpen(false);
      callback();
    },
    [setOpen]
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-background/60 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />

          {/* Dialog */}
          <div
            className="fixed left-[50%] top-[50%] z-[60] w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <CommandPrimitive
              className="overflow-hidden rounded-xl border border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl"
              shouldFilter={true}
              loop
            >
              {/* Search Input */}
              <div className="flex items-center border-b border-border/30 px-4 bg-background/40 backdrop-blur-sm">
                <IconSearch className="mr-3 h-5 w-5 shrink-0 text-muted-foreground" />
                <CommandPrimitive.Input
                  autoFocus
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Search courses, lessons, and resources..."
                  className="flex h-14 w-full bg-transparent font-mono text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Results */}
              <CommandPrimitive.List className="max-h-[400px] overflow-y-auto overscroll-contain p-2 bg-background/30 backdrop-blur-sm">
                <CommandPrimitive.Empty className="py-12 text-center text-sm text-muted-foreground">
                  No results found.
                </CommandPrimitive.Empty>

                {/* Courses Group */}
                {courses.length > 0 && (
                  <CommandPrimitive.Group
                    heading={
                      <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        <IconBook className="h-3 w-3" />
                        Courses
                      </div>
                    }
                  >
                    {courses.map((course) => (
                      <CommandPrimitive.Item
                        key={course.id}
                        value={`${course.title} ${course.description}`}
                        onSelect={() =>
                          handleSelect(() =>
                            router.push(`/modules/${course.slug}`)
                          )
                        }
                        className="relative flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors hover:bg-accent/50"
                      >
                        <IconBook className="h-4 w-4 text-primary" />
                        <div className="flex flex-col gap-0.5 text-left">
                          <span className="font-medium">{course.title}</span>
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {course.description}
                          </span>
                        </div>
                      </CommandPrimitive.Item>
                    ))}
                  </CommandPrimitive.Group>
                )}

                {/* Lessons Group */}
                {lessons.length > 0 && (
                  <CommandPrimitive.Group
                    heading={
                      <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        <IconFileText className="h-3 w-3" />
                        Lessons
                      </div>
                    }
                  >
                    {lessons.map((lesson) => (
                      <CommandPrimitive.Item
                        key={lesson.id}
                        value={`${lesson.title} ${lesson.courseTitle}`}
                        onSelect={() =>
                          handleSelect(() =>
                            router.push(
                              `/modules/${lesson.courseSlug}/${lesson.lessonSlug}`
                            )
                          )
                        }
                        className="relative flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors hover:bg-accent/50"
                      >
                        <IconFileText className="h-4 w-4 text-secondary" />
                        <div className="flex flex-col gap-0.5 text-left">
                          <span className="font-medium">{lesson.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {lesson.courseTitle}
                          </span>
                        </div>
                      </CommandPrimitive.Item>
                    ))}
                  </CommandPrimitive.Group>
                )}

                {/* Vault Group */}
                {vaultItems.length > 0 && (
                  <CommandPrimitive.Group
                    heading={
                      <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        <IconLibrary className="h-3 w-3" />
                        Vault Resources
                      </div>
                    }
                  >
                    {vaultItems.map((item) => (
                      <CommandPrimitive.Item
                        key={item.id}
                        value={`${item.title} ${item.tags.join(" ")}`}
                        onSelect={() =>
                          handleSelect(() => window.open(item.url, "_blank"))
                        }
                        className="relative flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors hover:bg-accent/50"
                      >
                        <IconLibrary className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col gap-0.5 text-left">
                          <span className="font-medium">{item.title}</span>
                          {item.tags.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {item.tags.slice(0, 3).join(", ")}
                            </span>
                          )}
                        </div>
                      </CommandPrimitive.Item>
                    ))}
                  </CommandPrimitive.Group>
                )}
              </CommandPrimitive.List>
            </CommandPrimitive>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export const CommandMenu = {
  Root: CommandMenuRoot,
  Trigger: CommandMenuTrigger,
  Dialog: CommandMenuDialog,
};
