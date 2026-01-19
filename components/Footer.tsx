"use client"

import GradientBlinds from "@/components/GradientBlinds"

export function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-[#001F4D] [mask-image:url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22 preserveAspectRatio=%22none%22><path d=%22M 0 12 C 0 3, 3 0, 12 0 L 88 0 C 97 0, 100 3, 100 12 L 100 100 L 0 100 Z%22 fill=%22black%22/></svg>')] [mask-size:100%_100%] -mt-12">
      {/* Gradient Blinds Background */}
      <GradientBlinds
        className="absolute inset-0"
        gradientColors={["#4E91EC", "#FE6515"]}
        angle={15}
        noise={0.84}
        blindCount={9}
        blindMinWidth={110}
        spotlightRadius={1}
        distortAmount={10}
        mouseDampening={1}
        shineDirection="left"
        spotlightSoftness={0.5}
        spotlightOpacity={0.8}
        mixBlendMode="normal"
      />

      {/* Centered hollow glowing text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative select-none">
          {/* Outer glow layer - most diffuse */}
          <svg
            className="absolute inset-0 w-full h-full blur-[20px] opacity-60"
            viewBox="0 0 200 120"
            aria-hidden="true"
          >
            <text
              x="100"
              y="50"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-none stroke-white"
              style={{
                fontFamily: "var(--font-eb-garamond), 'EB Garamond', Georgia, serif",
                fontSize: "48px",
                fontWeight: 400,
                strokeWidth: "2px",
              }}
            >
              web
            </text>
            <text
              x="100"
              y="95"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-none stroke-white"
              style={{
                fontFamily: "var(--font-eb-garamond), 'EB Garamond', Georgia, serif",
                fontSize: "48px",
                fontWeight: 400,
                strokeWidth: "2px",
              }}
            >
              dev.
            </text>
          </svg>

          {/* Medium glow layer */}
          <svg
            className="absolute inset-0 w-full h-full blur-[10px] opacity-70"
            viewBox="0 0 200 120"
            aria-hidden="true"
          >
            <text
              x="100"
              y="50"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-none stroke-white"
              style={{
                fontFamily: "var(--font-eb-garamond), 'EB Garamond', Georgia, serif",
                fontSize: "48px",
                fontWeight: 400,
                strokeWidth: "1.5px",
              }}
            >
              web
            </text>
            <text
              x="100"
              y="95"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-none stroke-white"
              style={{
                fontFamily: "var(--font-eb-garamond), 'EB Garamond', Georgia, serif",
                fontSize: "48px",
                fontWeight: 400,
                strokeWidth: "1.5px",
              }}
            >
              dev.
            </text>
          </svg>

          {/* Inner glow layer - tighter */}
          <svg
            className="absolute inset-0 w-full h-full blur-[4px] opacity-90"
            viewBox="0 0 200 120"
            aria-hidden="true"
          >
            <text
              x="100"
              y="50"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-none stroke-white"
              style={{
                fontFamily: "var(--font-eb-garamond), 'EB Garamond', Georgia, serif",
                fontSize: "48px",
                fontWeight: 400,
                strokeWidth: "1px",
              }}
            >
              web
            </text>
            <text
              x="100"
              y="95"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-none stroke-white"
              style={{
                fontFamily: "var(--font-eb-garamond), 'EB Garamond', Georgia, serif",
                fontSize: "48px",
                fontWeight: 400,
                strokeWidth: "1px",
              }}
            >
              dev.
            </text>
          </svg>

          {/* Main crisp stroke - the actual visible outline */}
          <svg
            className="relative w-[200px] h-[120px] md:w-[300px] md:h-[180px]"
            viewBox="0 0 200 120"
            role="img"
            aria-label="web dev."
          >
            <defs>
              <filter id="footer-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <text
              x="100"
              y="50"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-none stroke-white"
              style={{
                fontFamily: "var(--font-eb-garamond), 'EB Garamond', Georgia, serif",
                fontSize: "48px",
                fontWeight: 400,
                strokeWidth: "0.8px",
              }}
              filter="url(#footer-glow)"
            >
              web
            </text>
            <text
              x="100"
              y="95"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-none stroke-white"
              style={{
                fontFamily: "var(--font-eb-garamond), 'EB Garamond', Georgia, serif",
                fontSize: "48px",
                fontWeight: 400,
                strokeWidth: "0.8px",
              }}
              filter="url(#footer-glow)"
            >
              dev.
            </text>
          </svg>
        </div>
      </div>

      {/* Subtle vignette overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)"
        }}
      />
    </footer>
  )
}

export default Footer
