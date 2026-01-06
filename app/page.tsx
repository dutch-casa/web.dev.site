"use client"

import FaultyTerminal from "@/components/FaultyTerminal"
import FuzzyText from "@/components/FuzzyText"
import { WobbleCard } from "@/components/ui/wobble-card"

export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-y-auto">
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
        pageLoadAnimation={true}
        dpr={2}
        className="absolute inset-0 z-0"
      />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 px-4 pt-32">
        <FuzzyText
          fontSize={window.innerWidth < 768 ? 48 : 80}
          fontWeight={900}
          className="font-bold"
        >
          Learn Everything
        </FuzzyText>
        <FuzzyText
          fontSize={window.innerWidth < 768 ? 48 : 80}
          fontWeight={900}
          color="#0171E4"
          className="font-bold"
        >
          Build Anything.
        </FuzzyText>
        <div className="motion-enter flex flex-col items-center justify-center gap-4" style={{ animationDelay: "360ms" }}>
          <button
            onClick={() => window.open("https://discord.gg/UQXykTpjwG", "_blank")}
            className="group/btn relative rounded-full bg-[#0171E4] px-8 py-3 text-white transition-all duration-[120ms] ease-out hover:scale-105 hover:shadow-lg active:scale-95"
          >
            <span className="relative z-10 font-semibold">Join Discord</span>
            <span className="absolute inset-0 rounded-full bg-white/20 blur-xl opacity-0 transition-opacity duration-[300ms] ease-out group-hover/btn:opacity-100" />
          </button>
          <button className="rounded-full border-2 border-border bg-background px-8 py-3 text-foreground transition-all duration-[120ms] ease-out hover:border-[#0171E4] hover:text-[#0171E4] active:scale-95">
            Start Learning
          </button>
        </div>
      </div>

      <div className="relative z-10 mt-32 w-full max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WobbleCard className="bg-[#FE6515]"><div className="h-64" /></WobbleCard>
          <WobbleCard className="bg-[#0171E4]"><div className="h-64" /></WobbleCard>
        </div>
        <div className="mt-6">
          <WobbleCard className="bg-black"><div className="h-64" /></WobbleCard>
        </div>
      </div>
    </main>
  )
}
