"use client"

import { IconSettings, IconMinus, IconPlus } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useSettings } from "@/lib/tutorial-kit/settings"

export function SettingsPopover() {
  const {
    vimMode,
    fontSize,
    lineNumbers,
    wordWrap,
    setVimMode,
    setFontSize,
    setLineNumbers,
    setWordWrap,
  } = useSettings()

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "inline-flex items-center justify-center",
          "h-7 w-7 rounded-md text-sm font-medium",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50"
        )}
        title="Editor settings"
      >
        <IconSettings className="w-4 h-4" />
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Editor Settings</h4>

          {/* Vim Mode */}
          <div className="flex items-center justify-between">
            <Label htmlFor="vim-mode" className="text-sm cursor-pointer">
              Vim Mode
            </Label>
            <Switch
              id="vim-mode"
              checked={vimMode}
              onCheckedChange={setVimMode}
            />
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <Label className="text-sm">Font Size</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setFontSize(fontSize - 1)}
                disabled={fontSize <= 10}
              >
                <IconMinus className="w-3 h-3" />
              </Button>
              <span className="w-8 text-center text-sm font-mono">{fontSize}</span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setFontSize(fontSize + 1)}
                disabled={fontSize >= 24}
              >
                <IconPlus className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Line Numbers */}
          <div className="flex items-center justify-between">
            <Label htmlFor="line-numbers" className="text-sm cursor-pointer">
              Line Numbers
            </Label>
            <Switch
              id="line-numbers"
              checked={lineNumbers}
              onCheckedChange={setLineNumbers}
            />
          </div>

          {/* Word Wrap */}
          <div className="flex items-center justify-between">
            <Label htmlFor="word-wrap" className="text-sm cursor-pointer">
              Word Wrap
            </Label>
            <Switch
              id="word-wrap"
              checked={wordWrap}
              onCheckedChange={setWordWrap}
            />
          </div>

          {/* Vim indicator */}
          {vimMode && (
            <p className="text-xs text-muted-foreground">
              Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Esc</kbd> to enter Normal mode
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
