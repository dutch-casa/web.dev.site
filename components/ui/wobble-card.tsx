"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface WobbleCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  intensity?: number;
  perspective?: number;
  radialGradient?: boolean;
  noise?: boolean;
}

export function WobbleCard({
  children,
  className,
  intensity = 20,
  perspective = 1,
  radialGradient = true,
  noise: showNoise = true,
  style,
  ...props
}: WobbleCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = event;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (clientX - (rect.left + rect.width / 2)) / intensity;
    const y = (clientY - (rect.top + rect.height / 2)) / intensity;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const transform = useMotionTemplate`
    translate3d(${mouseX}px, ${mouseY}px, 0) scale3d(1, 1, 1)
  `;

  const innerTransform = useMotionTemplate`
    translate3d(${-mouseX}px, ${-mouseY}px, 0) scale3d(${1 + 0.03 * perspective}, ${1 + 0.03 * perspective}, 1)
  `;

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: "transform 0.1s ease-out",
      }}
      className={cn(
        "mx-auto w-full relative rounded-2xl overflow-hidden bg-foreground/5",
        radialGradient && "[background-image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.3),rgba(255,255,255,0))]",
        className
      )}
      {...(props as HTMLMotionProps<"div">)}
    >
      <div
        className="relative h-full overflow-hidden sm:rounded-2xl"
        style={{
          boxShadow: "0 10px 32px rgba(34, 42, 53, 0.12), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.05), 0 4px 6px rgba(34, 42, 53, 0.08), 0 24px 108px rgba(47, 48, 55, 0.10)",
        }}
      >
        <motion.div
          style={{
            transform: isHovering ? innerTransform : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
            transition: "transform 0.1s ease-out",
          }}
          className={cn("h-full px-4 py-20 sm:px-10", perspective > 1 && "origin-center")}
        >
          {showNoise && <WobbleCardNoise />}
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
}

function WobbleCardNoise() {
  return (
    <div
      className="absolute inset-0 w-full h-full scale-[1.2] transform opacity-[0.08] [mask-image:radial-gradient(#fff,transparent,75%)] pointer-events-none"
      style={{
        backgroundImage: "url(/noise.webp)",
        backgroundSize: "30%",
      }}
    />
  );
}

WobbleCard.Elevated = (props: WobbleCardProps) => (
  <WobbleCard
    {...props}
    intensity={25}
    perspective={1.5}
    radialGradient={true}
    noise={true}
    className={cn("bg-foreground/5", props.className)}
  />
);

WobbleCard.Glass = (props: WobbleCardProps) => (
  <WobbleCard
    {...props}
    intensity={30}
    perspective={1}
    radialGradient={true}
    noise={false}
    className={cn("bg-white/5 backdrop-blur-sm border border-white/10", props.className)}
  />
);

WobbleCard.Flat = (props: WobbleCardProps) => (
  <WobbleCard
    {...props}
    intensity={40}
    perspective={0.5}
    radialGradient={false}
    noise={true}
    className={cn("bg-foreground/10", props.className)}
  />
);

export type { WobbleCardProps };
