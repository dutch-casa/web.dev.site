"use client"

import dynamic from "next/dynamic"
import FaultyTerminal from "@/components/FaultyTerminal"
import FuzzyText from "@/components/FuzzyText"
import { WobbleCard } from "@/components/ui/wobble-card"
import TypingCode from "@/components/TypingCode"
import { Footer } from "@/components/Footer"
import { MacbookScroll } from "@/components/ui/macbook-scroll"
import { EvervaultCard } from "@/components/ui/evervault-card"

const Globe = dynamic(() => import("@/components/ui/globe").then((mod) => mod.World), { ssr: false })
const CrowdCanvas = dynamic(() => import("@/components/CrowdCanvas").then((mod) => mod.CrowdCanvas), { ssr: false })

const globeConfig = {
  pointSize: 3,
  globeColor: "#062056",
  showAtmosphere: true,
  atmosphereColor: "#FFFFFF",
  atmosphereAltitude: 0.1,
  emissive: "#000000",
  emissiveIntensity: 0.1,
  shininess: 0.9,
  polygonColor: "rgba(255,255,255,0.7)",
  ambientLight: "#ffffff",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#ffffff",
  arcTime: 2000,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  autoRotate: true,
  autoRotateSpeed: 1,
}

const sampleArcs = [
  { order: 1, startLat: 40.7128, startLng: -74.006, endLat: 34.0522, endLng: -118.2437, arcAlt: 0.1, color: "#FE6515" },
  { order: 2, startLat: 34.0522, startLng: -118.2437, endLat: 35.6762, endLng: -105.7842, arcAlt: 0.1, color: "#FE6515" },
  { order: 3, startLat: 35.6762, startLng: -105.7842, endLat: 23.0128, endLng: -82.366, arcAlt: 0.1, color: "#FE6515" },
  { order: 4, startLat: 23.0128, startLng: -82.366, endLat: 35.6542, endLng: -78.7601, arcAlt: 0.1, color: "#FE6515" },
]

export default function Home() {
  return (
    <main className="relative w-full min-h-screen bg-background">
      <div className="relative w-full h-screen">
        <FaultyTerminal
          tint="#FE6515"
          scale={1.5}
          gridMul={[1.5, 0.8]}
          digitSize={1.2}
          scanlineIntensity={0.4}
          glitchAmount={1.2}
          flickerAmount={0.8}
          noiseAmp={0.8}
          curvature={0.15}
          brightness={1.1}
          mouseReact={true}
          mouseStrength={0.3}
          pageLoadAnimation={false}
          dpr={2}
          className="w-full h-full pointer-events-none"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4">
          <FuzzyText
            fontSize={typeof window !== "undefined" && window.innerWidth < 768 ? 48 : 80}
            fontWeight={900}
            className="font-bold pointer-events-none"
          >
            Learn Everything
          </FuzzyText>
          <FuzzyText
            fontSize={typeof window !== "undefined" && window.innerWidth < 768 ? 48 : 80}
            fontWeight={900}
            color="#0171E4"
            className="font-bold pointer-events-none"
          >
            Build Anything.
          </FuzzyText>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8 px-4">
            <button
              onClick={() => window.open("https://discord.gg/UQXykTpjwG", "_blank")}
              className="group relative px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white bg-[#0171E4] rounded-full transition-all duration-120 ease-out-cubic hover:scale-105 active:scale-95"
            >
              <span className="relative z-10">Join Discord</span>
              <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 blur-xl" />
            </button>
            <a
              href="/modules"
              className="relative px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold text-foreground bg-white border-2 border-foreground/20 rounded-full transition-all duration-120 ease-out-cubic hover:scale-105 hover:border-[#0171E4] hover:text-[#0171E4] active:scale-95"
            >
              Start Learning
            </a>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 pb-8 mt-32 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <a href="/modules" className="block">
            <WobbleCard className="bg-[#FE6515] h-80 relative overflow-hidden" containerClassName="relative p-0" noise={false}>
              <div className="absolute inset-0">
                <Globe globeConfig={globeConfig} data={sampleArcs} />
              </div>
              <span className="absolute top-8 left-8 text-white text-2xl font-semibold">
                Become a World Class Dev
              </span>
            </WobbleCard>
          </a>

          <a href="https://discord.gg/UQXykTpjwG" target="_blank" className="block">
            <WobbleCard className="bg-[#0171E4] h-80 relative overflow-hidden" containerClassName="relative p-0" noise={false}>
              <CrowdCanvas className="w-full h-full" scale={0.3} />
              <span className="absolute top-8 left-8 text-white text-2xl font-semibold">
                Join the Community
              </span>
            </WobbleCard>
          </a>
        </div>

        <div className="mt-8 relative pointer-events-auto">
          <a href="/modules" className="block">
            <WobbleCard className="bg-black h-80 relative overflow-hidden" containerClassName="relative p-0" noise={false}>
              <TypingCode className="absolute inset-0 flex items-center" />
              <span className="absolute top-8 left-8 text-white text-2xl font-semibold">
                Build Real Projects
              </span>
            </WobbleCard>
          </a>
        </div>

        <MacbookScroll
          title="Start learning now!"
          showGradient={false}
        >
          <EvervaultCard className="w-full h-full" />
        </MacbookScroll>
      </div>

      <Footer />
    </main>
  )
}
