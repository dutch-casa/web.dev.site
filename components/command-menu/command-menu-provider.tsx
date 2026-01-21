"use client";

import * as React from "react";
import { CommandMenu } from "./command-menu";
import type { SearchData } from "@/lib/search-data";

interface CommandMenuProviderProps {
  children: React.ReactNode;
  searchData: SearchData;
}

export function CommandMenuProvider({
  children,
  searchData,
}: CommandMenuProviderProps) {
  return (
    <CommandMenu.Root>
      {children}
      <CommandMenu.Dialog
        courses={searchData.courses}
        lessons={searchData.lessons}
        vaultItems={searchData.vaultItems}
      />
    </CommandMenu.Root>
  );
}
