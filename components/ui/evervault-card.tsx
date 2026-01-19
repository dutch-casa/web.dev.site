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
    setRandomString(generateRandomString(8000));

    const interval = setInterval(() => {
      setRandomString(generateRandomString(8000));
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        "bg-transparent flex items-center justify-center w-full h-full relative",
        className
      )}
    >
      <div className="w-full relative overflow-hidden bg-black flex items-start justify-start h-full">
        {/* Full coverage gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B00] via-[#FF4500] to-[#0090FF] opacity-90" />

        {/* Random characters layer - edge to edge */}
        <p className="absolute inset-0 text-[10px] leading-none break-all whitespace-pre-wrap text-white/80 font-mono font-bold mix-blend-overlay">
          {randomString}
        </p>

        {/* Scanline effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
          }}
        />

        {/* Content - left aligned */}
        <div className="relative z-10 flex flex-col items-start justify-end p-5">
          <div className="relative rounded-xl flex flex-col items-start text-white p-5 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl shadow-black/20"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
              boxShadow: "inset 0 1px 1px rgba(255,255,255,0.2), 0 20px 40px rgba(0,0,0,0.3)",
            }}
          >
            <p className="text-white/95 text-base leading-relaxed font-light text-left max-w-[280px]">
              <span className="text-white font-semibold block mb-2">Web dev is hard. You&apos;ve got this.</span>
              Real projects. Clear explanations. No fluff. Just the skills you need to build anything.
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
