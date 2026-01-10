"use client"

export function TypingCode({ className }: { className?: string }) {
  return (
    <div className={`font-mono text-sm md:text-base ${className}`}>
      <style jsx>{`
        @keyframes typing {
          0%, 10% { width: 0; }
          30%, 70% { width: 11ch; }
          90%, 100% { width: 0; }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .typing-text {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          animation: typing 4s steps(11) infinite;
        }
        .cursor {
          animation: blink 1s step-end infinite;
        }
      `}</style>
      <pre className="text-left p-4 md:p-6">
        <code>
          <span className="text-pink-400">{"<"}</span>
          <span className="text-red-400">h1</span>
          <span className="text-pink-400">{">"}</span>
          {"\n"}
          <span className="text-white/90">{"    "}</span>
          <span className="typing-text text-white/90">Hello World</span>
          <span className="cursor text-white relative -top-1.5">|</span>
          {"\n"}
          <span className="text-pink-400">{"</"}</span>
          <span className="text-red-400">h1</span>
          <span className="text-pink-400">{">"}</span>
        </code>
      </pre>
    </div>
  )
}

export default TypingCode
