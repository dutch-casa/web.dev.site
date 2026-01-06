"use client"

import React, { useEffect, useRef } from "react"
import { gsap } from "gsap"

interface CrowdCanvasProps {
  scale?: number
}

interface Peep {
  id: number
  svg: string
  x: number
  y: number
  anchorY: number
  scaleX: number
  width: number
  height: number
  walk: gsap.core.Timeline | null
}

const PEEP_FILES = Array.from({ length: 210 }, (_, i) => {
  const num = i + 1
  return {
    png: `/Bust/peep-${num}.png`,
    svg: `/Bust/peep-${num}.svg`,
  }
})

function CrowdCanvas({ scale = 1 }: CrowdCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const peepsRef = useRef<Peep[]>([])
  const availablePeepsRef = useRef<Peep[]>([])
  const stageRef = useRef({ width: 0, height: 0 })

  const randomRange = (min: number, max: number): number =>
    min + Math.random() * (max - min)

  const randomIndex = (array: Peep[]): number =>
    Math.floor(Math.random() * array.length)

  const getRandomPeep = (): Peep | undefined => {
    const available = availablePeepsRef.current
    if (available.length === 0) return undefined
    return available[randomIndex(available)]
  }

  const resetPeep = (peep: Peep, targetY: number): void => {
    const direction = Math.random() > 0.5 ? 1 : -1
    const offsetY = randomRange(0, 250)
    const startX = direction === 1 ? -peep.width : stageRef.current.width
    const endX = direction === 1 ? stageRef.current.width : 0

    const tl = gsap.timeline()
    tl.timeScale(randomRange(0.5, 1.5))

    tl.to(peep, {
      duration: 10,
      x: endX,
      ease: "none",
    }, 0)

    tl.to(peep, {
      duration: 2.5,
      repeat: 4,
      y: targetY - 10,
      yoyo: true,
      ease: "power1.inOut",
    }, 0)

    peep.walk = tl
  }

  const walks = [resetPeep]

  const createPeeps = (): void => {
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!canvas || !stage) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const peepSize = 60 * scale
    const rows = Math.floor(stage.height / peepSize)
    const cols = Math.floor(stage.width / peepSize)
    const total = rows * cols

    const allPeeps: Peep[] = []

    for (let i = 0; i < total; i++) {
      const row = Math.floor(i / cols)
      const col = i % cols

      const { svg } = PEEP_FILES[i % 210]
      const peep: Peep = {
        id: i,
        svg,
        x: col * peepSize + peepSize / 2,
        y: row * peepSize + peepSize / 2,
        anchorY: 0,
        scaleX: 1,
        width: peepSize,
        height: peepSize,
        walk: undefined as unknown,
      }

      allPeeps.push(peep)
    }

    availablePeepsRef.current = [...allPeeps]
  }

  const initCrowd = (): void => {
    while (availablePeepsRef.current.length > 0) {
      const newPeep = addPeepToCrowd()
      if (newPeep) {
        newPeep.walk.progress(Math.random())
      }
    }
  }

  const addPeepToCrowd = (): Peep | undefined => {
    const available = availablePeepsRef.current
    if (available.length === 0) return undefined

    const index = Math.floor(Math.random() * available.length)
    const peep = available[index]
    available.splice(index, 1)
    availablePeepsRef.current = available

    const walk = walks[Math.floor(Math.random() * walks.length)]

    const tl = gsap.timeline()
    tl.timeScale(randomRange(0.8, 1.2))

    tl.call(() => {
      if ((peep as Peep).anchorY === 0) {
        (peep as Peep).anchorY = -(peep as Peep).height
      }
    }, undefined as unknown)

    tl.to(peep, {
      duration: 2,
      y: (peep as Peep).anchorY - 20,
      ease: "power2.out",
    }, 0)

    tl.to(peep, {
      duration: 0.5,
      y: (peep as Peep).anchorY,
      ease: "bounce.out",
    }, 0)

    tl.to(peep, {
      duration: 4,
      repeat: 2,
      x: "+=100",
      ease: "none",
    }, 0)

    tl.to(peep, {
      duration: 1,
      x: 0,
      ease: "power2.inOut",
    }, 0)

    tl.eventCallback("onComplete", () => {
      removePeepFromCrowd(peep)
      addPeepToCrowd()
    })

    (peep as Peep).walk = tl
    return peep
  }

  const removePeepFromCrowd = (peep: Peep): void => {
    const crowd = peepsRef.current
    const index = crowd.indexOf(peep)
    if (index > -1) {
      crowd.splice(index, 1)
      availablePeepsRef.current.push(peep)
    }
  }

  const render = (): void => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    const stage = stageRef.current

    canvas.width = stage.width * dpr
    canvas.height = stage.height * dpr

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.scale(dpr, dpr)

    const crowd = peepsRef.current
    crowd.sort((a, b) => a.anchorY - b.anchorY)

    crowd.forEach((peep) => {
      ctx.save()
      ctx.translate(peep.x, peep.y)
      ctx.scale(peep.scaleX, 1)

      const img = new Image()
      img.src = peep.svg
      img.onload = () => {
        const aspect = img.width / img.height
        const drawWidth = 60 * scale
        const drawHeight = drawWidth / aspect

        ctx.drawImage(
          img,
          0,
          0,
          drawWidth,
          drawHeight,
        )

        ctx.restore()
      }
    })

    ctx.restore()
  }

  const resize = (): void => {
    const canvas = canvasRef.current
    if (!canvas) return

    const stage = stageRef.current
    stage.width = canvas.clientWidth
    stage.height = canvas.clientHeight

    canvas.width = stage.width * window.devicePixelRatio
    canvas.height = stage.height * window.devicePixelRatio

    const crowd = peepsRef.current
    crowd.forEach((peep) => {
      const peepWalk = peep.walk
      if (peepWalk) {
        peepWalk.kill()
      }
    })

    peepsRef.current = []
    availablePeepsRef.current = []
  }

  const init = (): void => {
    createPeeps()
    resize()
    gsap.ticker.add(render)
    initCrowd()
  }

  useEffect(() => {
    init()

    return () => {
      gsap.ticker.remove(render)
      const crowd = peepsRef.current
      crowd.forEach((peep) => {
        const peepWalk = peep.walk
        if (peepWalk) {
          peepWalk.kill()
        }
      })
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}

export { CrowdCanvas }

