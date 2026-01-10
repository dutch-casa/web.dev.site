"use client"

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconVolume,
  IconVolumeOff,
  IconMaximize,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

type VideoState = {
  isPlaying: boolean
  isMuted: boolean
  isFullscreen: boolean
  currentTime: number
  duration: number
  buffered: number
  volume: number
  isControlsVisible: boolean
}

type VideoActions = {
  play: () => void
  pause: () => void
  togglePlay: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  toggleFullscreen: () => void
}

type VideoContextValue = VideoState & VideoActions & {
  containerRef: React.RefObject<HTMLDivElement | null>
}

const VideoContext = createContext<VideoContextValue | null>(null)

function useVideoContext() {
  const ctx = useContext(VideoContext)
  if (!ctx) throw new Error("Video.* must be used within Video.Root")
  return ctx
}

type RootProps = {
  src: string
  children?: ReactNode
}

function Root({ src, children }: RootProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YT.Player | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const [state, setState] = useState<VideoState>({
    isPlaying: false,
    isMuted: false,
    isFullscreen: false,
    currentTime: 0,
    duration: 0,
    buffered: 0,
    volume: 100,
    isControlsVisible: true,
  })

  const videoId = src.startsWith("youtube:") ? src.slice(8) : src

  useEffect(() => {
    if (typeof window === "undefined") return

    if (!window.YT) {
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      const firstScriptTag = document.getElementsByTagName("script")[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }

    const checkYT = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(checkYT)
        initPlayer()
      }
    }, 100)

    return () => clearInterval(checkYT)
  }, [])

  const initPlayer = useCallback(() => {
    if (!containerRef.current || playerRef.current) return

    const playerId = `yt-player-${videoId}`
    const playerDiv = document.createElement("div")
    playerDiv.id = playerId
    containerRef.current.querySelector(".video-player-container")?.appendChild(playerDiv)

    playerRef.current = new window.YT.Player(playerId, {
      videoId,
      playerVars: {
        controls: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        playsinline: 1,
      },
      events: {
        onReady: (e) => {
          setIsReady(true)
          setState((s) => ({
            ...s,
            duration: e.target.getDuration(),
            volume: e.target.getVolume(),
          }))
        },
        onStateChange: (e) => {
          setState((s) => ({
            ...s,
            isPlaying: e.data === window.YT.PlayerState.PLAYING,
          }))
        },
      },
    })
  }, [videoId])

  useEffect(() => {
    if (!isReady || !playerRef.current) return

    const interval = setInterval(() => {
      const player = playerRef.current
      if (!player) return

      const loadedFraction = player.getVideoLoadedFraction?.() ?? 0
      setState((s) => ({
        ...s,
        currentTime: player.getCurrentTime?.() ?? 0,
        buffered: loadedFraction * 100,
      }))
    }, 250)

    return () => clearInterval(interval)
  }, [isReady])

  const actions = useMemo<VideoActions>(
    () => ({
      play: () => playerRef.current?.playVideo?.(),
      pause: () => playerRef.current?.pauseVideo?.(),
      togglePlay: () => {
        if (state.isPlaying) {
          playerRef.current?.pauseVideo?.()
        } else {
          playerRef.current?.playVideo?.()
        }
      },
      seek: (time) => playerRef.current?.seekTo?.(time, true),
      setVolume: (volume) => {
        playerRef.current?.setVolume?.(volume)
        setState((s) => ({ ...s, volume, isMuted: volume === 0 }))
      },
      toggleMute: () => {
        if (state.isMuted) {
          playerRef.current?.unMute?.()
          setState((s) => ({ ...s, isMuted: false }))
        } else {
          playerRef.current?.mute?.()
          setState((s) => ({ ...s, isMuted: true }))
        }
      },
      toggleFullscreen: () => {
        if (!containerRef.current) return
        if (document.fullscreenElement) {
          document.exitFullscreen()
          setState((s) => ({ ...s, isFullscreen: false }))
        } else {
          containerRef.current.requestFullscreen()
          setState((s) => ({ ...s, isFullscreen: true }))
        }
      },
    }),
    [state.isPlaying, state.isMuted]
  )

  const isControlsVisible = !state.isPlaying || isHovered

  const contextValue = useMemo<VideoContextValue>(
    () => ({
      ...state,
      ...actions,
      isControlsVisible,
      containerRef,
    }),
    [state, actions, isControlsVisible]
  )

  return (
    <VideoContext.Provider value={contextValue}>
      <motion.div
        ref={containerRef}
        className="group relative my-6 aspect-video w-full overflow-hidden rounded-xl bg-black"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="video-player-container absolute inset-0 [&>div]:size-full [&>div>iframe]:size-full" />

        <button
          type="button"
          onClick={actions.togglePlay}
          className="absolute inset-0 z-10 cursor-pointer"
          aria-label={state.isPlaying ? "Pause" : "Play"}
        />

        {children}
      </motion.div>
    </VideoContext.Provider>
  )
}

function Controls() {
  const {
    isPlaying,
    isMuted,
    currentTime,
    duration,
    buffered,
    isControlsVisible,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    seek,
  } = useVideoContext()

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    seek(percent * duration)
  }

  return (
    <AnimatePresence>
      {isControlsVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 to-transparent px-5 pb-4 pt-10"
        >
          <div
            className="mb-3 h-1.5 w-full cursor-pointer rounded-full bg-white/20"
            onClick={handleProgressClick}
          >
            <div className="absolute h-1.5 rounded-full bg-white/30" style={{ width: `${buffered}%` }} />
            <div className="relative h-1.5 rounded-full bg-white" style={{ width: `${progressPercent}%` }}>
              <div className="absolute -right-2 -top-1 size-5 rounded-full bg-white opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                className="flex size-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
              >
                {isPlaying ? <IconPlayerPause className="size-5" /> : <IconPlayerPlay className="size-5" />}
              </button>

              <button
                type="button"
                onClick={toggleMute}
                className="flex size-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
              >
                {isMuted ? <IconVolumeOff className="size-5" /> : <IconVolume className="size-5" />}
              </button>

              <span className="ml-2.5 text-sm tabular-nums text-white/90">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="flex size-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
            >
              <IconMaximize className="size-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export const Video = {
  Root,
  Controls,
}

export function YouTubeVideo({ src }: { src: string }) {
  return (
    <Video.Root src={src}>
      <Video.Controls />
    </Video.Root>
  )
}

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          videoId: string
          playerVars?: Record<string, unknown>
          events?: {
            onReady?: (event: { target: YT.Player }) => void
            onStateChange?: (event: { data: number }) => void
          }
        }
      ) => YT.Player
      PlayerState: {
        PLAYING: number
        PAUSED: number
        ENDED: number
      }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

declare namespace YT {
  interface Player {
    playVideo: () => void
    pauseVideo: () => void
    seekTo: (seconds: number, allowSeekAhead: boolean) => void
    setVolume: (volume: number) => void
    getVolume: () => number
    mute: () => void
    unMute: () => void
    isMuted: () => boolean
    getDuration: () => number
    getCurrentTime: () => number
    getVideoLoadedFraction: () => number
  }
}
