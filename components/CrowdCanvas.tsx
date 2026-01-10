"use client"

import { useRef, useCallback } from "react"
import { animate, useAnimationFrame } from "motion/react"

// === DOMAIN TYPES ===

type AnimationControls = ReturnType<typeof animate>

interface PeepState {
  readonly rect: readonly [x: number, y: number, w: number, h: number]
  readonly width: number
  readonly height: number
  x: number
  y: number
  anchorY: number
  scaleX: 1 | -1
  walkX: AnimationControls | null
  walkY: AnimationControls | null
}

interface Stage {
  width: number
  height: number
}

interface CrowdCanvasProps {
  src?: string;
  rows?: number;
  cols?: number;
  scale?: number;
  className?: string;
  useExternalCanvas?: boolean;
}

// === PURE FUNCTIONS ===

const randomInRange = (min: number, max: number): number =>
  min + Math.random() * (max - min)

const pickRandomIndex = (length: number): number =>
  Math.floor(Math.random() * length)

const removeAtIndex = <T,>(array: T[], index: number): T =>
  array.splice(index, 1)[0]

const easeQuadIn = (t: number): number => t * t

// === COMPONENT ===

function CrowdCanvas({
  src = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/175711/open-peeps-sheet.png",
  rows = 15,
  cols = 7,
  scale = 0.5,
  className,
  useExternalCanvas = false,
}: CrowdCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const stageRef = useRef<Stage>({ width: 0, height: 0 })
  const crowdRef = useRef<PeepState[]>([])
  const poolRef = useRef<PeepState[]>([])
  const allPeepsRef = useRef<PeepState[]>([])
  const isInitializedRef = useRef(false)

  const stopPeepAnimations = useCallback((peep: PeepState) => {
    peep.walkX?.stop()
    peep.walkY?.stop()
    peep.walkX = null
    peep.walkY = null
  }, [])

  const recyclePeep = useCallback((peep: PeepState) => {
    const crowd = crowdRef.current
    const pool = poolRef.current
    const idx = crowd.indexOf(peep)
    if (idx !== -1) {
      crowd.splice(idx, 1)
      pool.push(peep)
    }
  }, [])

  const spawnPeep = useCallback((): PeepState | null => {
    const pool = poolRef.current
    const crowd = crowdRef.current
    const stage = stageRef.current

    if (pool.length === 0) return null

    const peep = removeAtIndex(pool, pickRandomIndex(pool.length))

    // Direction: 1 = left-to-right, -1 = right-to-left
    const direction: 1 | -1 = Math.random() > 0.5 ? 1 : -1
    peep.scaleX = direction

    // Depth: 0 = back (higher up), 1 = front (lower down)
    const depth = easeQuadIn(Math.random())

    // Y position: push peeps down so bottom 45% is clipped (hides legless sprites)
    const clipAmount = peep.height * 0.45
    const baseY = stage.height - peep.height + clipAmount - (1 - depth) * peep.height * 0.5

    peep.anchorY = baseY
    peep.y = baseY

    // X position: start off-screen
    const startX = direction === 1 ? -peep.width : stage.width + peep.width
    const endX = direction === 1 ? stage.width : -peep.width
    peep.x = startX

    // Animation timing
    const walkDuration = randomInRange(8, 14)
    const bounceDuration = 0.25
    const bounceHeight = 6 + 4 * depth // Front peeps bounce more
    const bounceCount = Math.floor(walkDuration / bounceDuration)

    // Single X animation
    peep.walkX = animate(startX, endX, {
      duration: walkDuration,
      ease: "linear",
      onUpdate: (v) => { peep.x = v },
      onComplete: () => {
        stopPeepAnimations(peep)
        recyclePeep(peep)
        spawnPeep()
      },
    })

    // Single Y animation with repeat + mirror (yoyo)
    peep.walkY = animate(baseY, baseY - bounceHeight, {
      duration: bounceDuration,
      ease: "easeInOut",
      repeat: bounceCount,
      repeatType: "mirror",
      onUpdate: (v) => { peep.y = v },
    })

    crowd.push(peep)
    // Sort by depth for proper draw order (back to front)
    crowd.sort((a, b) => a.anchorY - b.anchorY)

    return peep
  }, [stopPeepAnimations, recyclePeep])

  const initializeCrowd = useCallback(() => {
    // Stop all existing animations
    crowdRef.current.forEach(stopPeepAnimations)
    crowdRef.current = []
    poolRef.current = [...allPeepsRef.current]

    // Spawn all peeps with staggered progress
    while (poolRef.current.length > 0) {
      const peep = spawnPeep()
      if (peep?.walkX && peep?.walkY) {
        const progress = Math.random()
        peep.walkX.time = progress * (peep.walkX.duration as number)
        peep.walkY.time = progress * (peep.walkY.duration as number)
      }
    }
  }, [stopPeepAnimations, spawnPeep])

  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return false

    const { width, height } = container.getBoundingClientRect()
    if (width === 0 || height === 0) return false

    const stage = stageRef.current
    const sizeChanged = Math.abs(width - stage.width) > 5 || Math.abs(height - stage.height) > 5

    stage.width = width
    stage.height = height
    canvas.width = width * devicePixelRatio
    canvas.height = height * devicePixelRatio

    return sizeChanged
  }, [])

  const createPeepPool = useCallback((img: HTMLImageElement) => {
    const { naturalWidth, naturalHeight } = img
    const total = rows * cols
    const spriteW = naturalWidth / rows
    const spriteH = naturalHeight / cols
    const displayW = spriteW * scale
    const displayH = spriteH * scale

    allPeepsRef.current = Array.from({ length: total }, (_, i): PeepState => ({
      rect: [
        (i % rows) * spriteW,
        Math.floor(i / rows) * spriteH,
        spriteW,
        spriteH,
      ] as const,
      width: displayW,
      height: displayH,
      x: 0,
      y: 0,
      anchorY: 0,
      scaleX: 1,
      walkX: null,
      walkY: null,
    }))
  }, [rows, cols, scale])

  // Ref callback for initialization
  const initializeCanvas = useCallback((container: HTMLDivElement | null) => {
    if (!container || isInitializedRef.current) return
    isInitializedRef.current = true
    containerRef.current = container

    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      imageRef.current = img
      createPeepPool(img)
      updateCanvasSize()
      initializeCrowd()

      // Debounced resize observer
      let timeout: ReturnType<typeof setTimeout> | null = null
      const observer = new ResizeObserver(() => {
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(() => {
          if (updateCanvasSize()) {
            initializeCrowd()
          }
        }, 150)
      })
      observer.observe(container)
    }

    img.src = src
  }, [src, createPeepPool, updateCanvasSize, initializeCrowd])

  // Render loop
  useAnimationFrame(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    const img = imageRef.current
    if (!canvas || !ctx || !img) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.scale(devicePixelRatio, devicePixelRatio)

    for (const peep of crowdRef.current) {
      ctx.save()
      ctx.translate(peep.x, peep.y)
      ctx.scale(peep.scaleX, 1)
      ctx.drawImage(
        img,
        peep.rect[0], peep.rect[1], peep.rect[2], peep.rect[3],
        0, 0, peep.width, peep.height
      )
      ctx.restore()
    }

    ctx.restore()
  })

  const content = (
    <div ref={initializeCanvas} className={className}>
      <canvas ref={canvasRef} className="size-full" />
    </div>
  )

  if (useExternalCanvas) {
    return content
  }

  return (
    <div ref={initializeCanvas} className={className}>
      <canvas ref={canvasRef} className="size-full" />
    </div>
  )
}

export { CrowdCanvas }
export type { CrowdCanvasProps }
