// TutorialKit Settings - Persisted to localStorage
import { create } from "zustand"
import { persist } from "zustand/middleware"

// ----------------------------------------------------------------------------
// Settings Types
// ----------------------------------------------------------------------------

export interface TutorialSettings {
  /** Enable vim keybindings in editor */
  vimMode: boolean
  /** Editor font size */
  fontSize: number
  /** Show line numbers */
  lineNumbers: boolean
  /** Word wrap mode */
  wordWrap: boolean
}

export interface SettingsStore extends TutorialSettings {
  setVimMode: (enabled: boolean) => void
  setFontSize: (size: number) => void
  setLineNumbers: (enabled: boolean) => void
  setWordWrap: (enabled: boolean) => void
  reset: () => void
}

// ----------------------------------------------------------------------------
// Default Settings
// ----------------------------------------------------------------------------

const defaultSettings: TutorialSettings = {
  vimMode: false,
  fontSize: 14,
  lineNumbers: true,
  wordWrap: true,
}

// ----------------------------------------------------------------------------
// Settings Store (persisted to localStorage)
// ----------------------------------------------------------------------------

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setVimMode: (enabled) => set({ vimMode: enabled }),
      setFontSize: (size) => set({ fontSize: Math.max(10, Math.min(24, size)) }),
      setLineNumbers: (enabled) => set({ lineNumbers: enabled }),
      setWordWrap: (enabled) => set({ wordWrap: enabled }),
      reset: () => set(defaultSettings),
    }),
    {
      name: "tutorial-kit-settings",
    }
  )
)
