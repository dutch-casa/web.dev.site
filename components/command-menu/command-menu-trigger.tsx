"use client";

import * as React from "react";
import { motion } from "motion/react";
import { IconSearch } from "@tabler/icons-react";
import { useCommandMenu } from "./command-menu";

interface CommandMenuTriggerProps {
  className?: string;
}

export function CommandMenuTrigger({ className }: CommandMenuTriggerProps) {
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
