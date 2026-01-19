"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const EvervaultCard = ({
  className,
}: {
  className?: string;
}) => {
  const [randomString, setRandomString] = useState("");

  // Initialize and continuously update random string
  useEffect(() => {
    setRandomString(generateRandomString(2000));

    const interval = setInterval(() => {
      setRandomString(generateRandomString(2000));
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        "p-0.5 bg-transparent flex items-center justify-center w-full h-full relative",
        className
      )}
    >
      <div className="rounded-2xl w-full relative overflow-hidden bg-black flex items-center justify-center h-full">
        {/* Full coverage gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B00] via-[#FF4500] to-[#0090FF] opacity-90" />

        {/* Random characters layer */}
        <div className="absolute inset-0 overflow-hidden">
          <p className="absolute inset-0 text-[10px] leading-tight break-all whitespace-pre-wrap text-white/80 font-mono font-bold mix-blend-overlay">
            {randomString}
          </p>
        </div>

        {/* Scanline effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-4 p-6">
          <div className="relative rounded-xl flex flex-col items-center justify-center text-white p-5 backdrop-blur-md bg-black/60 border border-white/10">
            <p className="text-white/95 text-base leading-relaxed font-light text-center max-w-[280px]">
              <span className="text-white font-semibold block mb-2">Yeah, there&apos;s a lot to learn.</span>
              But hopefully this site can be a great place to help you start your journey.
            </p>
            <a
              href="/modules"
              className="mt-4 px-6 py-2.5 bg-[#FF5500] hover:bg-[#FF6B00] text-white font-semibold rounded-full transition-all duration-150 hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/30"
            >
              Let&apos;s go!
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(){}[]<>?/\\|~";

export const generateRandomString = (length: number) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
