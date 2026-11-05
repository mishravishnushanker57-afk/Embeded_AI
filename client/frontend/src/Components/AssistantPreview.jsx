import React, { useState } from 'react'

const themes = {
  dark: {
    bg: "bg-gradient-to-b from-[#060813] via-[#0b1021] to-[#060813]",
    overlay:
      "bg-[radial-gradient(circle_at_50%_0%,rgba(147,51,234,0.22),rgba(6,8,19,0)_60%)]",
    orb: "from-cyan-400 via-indigo-500 to-fuchsia-500",
    cardBorder:
      "bg-white/[0.03] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl",
    text: "text-zinc-100",
    sub: "text-zinc-400",
    listening: "text-emerald-400",
    wave: "bg-emerald-400",
    button:
      "bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-600 hover:brightness-110 shadow-[0_0_24px_rgba(147,51,234,0.35)]",
    micGlow: "shadow-[0_0_80px_rgba(168,85,247,0.35)] ring-1 ring-purple-500/20",
  },

  light: {
    bg: "bg-gradient-to-br from-purple-50/70 via-slate-50 to-emerald-50/60",
    overlay:
      "bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),transparent_70%)]",
    orb: "from-violet-500 via-sky-400 to-emerald-400",
    cardBorder:
      "bg-white/80 border border-slate-200/80 shadow-[0_12px_40px_-15px_rgba(0,0,0,0.07)] backdrop-blur-md",
    text: "text-slate-900",
    sub: "text-slate-500",
    listening: "text-emerald-600",
    wave: "bg-emerald-500",
    button:
      "bg-gradient-to-r from-slate-900 via-zinc-800 to-slate-900 text-white hover:brightness-105 shadow-md shadow-slate-900/10",
    micGlow: "shadow-[0_0_60px_rgba(99,102,241,0.2)] ring-1 ring-slate-200",
  },

  neon: {
    bg: "bg-gradient-to-b from-[#030712] via-[#021824] to-[#010811]",
    overlay:
      "bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.25),transparent_65%)]",
    orb: "from-cyan-400 via-teal-300 to-emerald-400",
    cardBorder:
      "bg-black/50 border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.15)] backdrop-blur-2xl",
    text: "text-cyan-50",
    sub: "text-cyan-200/60",
    listening: "text-cyan-400",
    wave: "bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)]",
    button:
      "bg-gradient-to-r from-cyan-500 to-emerald-400 text-black font-semibold hover:brightness-110 shadow-[0_0_25px_rgba(6,182,212,0.4)]",
    micGlow: "shadow-[0_0_70px_rgba(6,182,212,0.45)] ring-1 ring-cyan-400/40",
  },

  glass: {
    bg: "bg-gradient-to-br from-[#0a0f1d] via-[#101b33] to-[#05070e]",
    overlay:
      "bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_70%)]",
    orb: "from-white/60 via-sky-200/50 to-indigo-300/60",
    cardBorder:
      "bg-gradient-to-b from-white/[0.12] to-white/[0.03] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-2xl",
    text: "text-white",
    sub: "text-white/70",
    listening: "text-sky-300",
    wave: "bg-sky-300 shadow-[0_0_10px_rgba(125,211,252,0.6)]",
    button:
      "bg-white/10 hover:bg-white/20 text-white border border-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-xl",
    micGlow:
      "shadow-[0_0_70px_rgba(255,255,255,0.25)] ring-1 ring-white/30",
  },
}

function AssistantPreview() {
  const [theme, setTheme] = useState("dark")
  const [isListening, setIsListening] = useState(true)
  const current = themes[theme]

  return (
    <div className='flex items-center justify-center px-3 sm:px-4 py-10 sm:py-14 select-none'>
      <div
        className={`relative w-[280px] h-[460px] sm:w-[330px] sm:h-[510px] md:w-[380px] md:h-[560px] rounded-[32px] sm:rounded-[42px] overflow-hidden transition-all duration-500 ${current.bg} ${current.cardBorder} shadow-[0_20px_80px_rgba(0,0,0,0.28)]`}
      >
        {/* Ambient Gradient Overlay */}
        <div className={`absolute inset-0 pointer-events-none transition-all duration-500 ${current.overlay}`} />

        {/* Circular Theme Switchers */}
        <div className='absolute top-4 right-4 sm:top-5 sm:right-5 z-30 flex items-center gap-1.5 p-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/10'>
          {/* Dark Theme Button */}
          <button
            onClick={() => setTheme("dark")}
            title="Dark Theme"
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br from-[#060813] via-purple-950 to-[#060813] border transition-all cursor-pointer ${
              theme === "dark"
                ? "border-purple-400 scale-110 ring-2 ring-purple-400/40 shadow-sm"
                : "border-white/20 hover:border-white/50 opacity-70 hover:opacity-100"
            }`}
          />

          {/* Light Theme Button */}
          <button
            onClick={() => setTheme("light")}
            title="Light Theme"
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br from-purple-200 via-slate-100 to-emerald-200 border transition-all cursor-pointer ${
              theme === "light"
                ? "border-purple-500 scale-110 ring-2 ring-purple-400/40 shadow-sm"
                : "border-white/30 hover:border-white/60 opacity-70 hover:opacity-100"
            }`}
          />

          {/* Neon Theme Button */}
          <button
            onClick={() => setTheme("neon")}
            title="Neon Theme"
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 border transition-all cursor-pointer ${
              theme === "neon"
                ? "border-cyan-200 scale-110 ring-2 ring-cyan-400/60 shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                : "border-white/20 hover:border-white/50 opacity-70 hover:opacity-100"
            }`}
          />

          {/* Glass Theme Button */}
          <button
            onClick={() => setTheme("glass")}
            title="Glass Theme"
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br from-white/60 via-white/10 to-sky-300/40 backdrop-blur-md border transition-all cursor-pointer ${
              theme === "glass"
                ? "border-white scale-110 ring-2 ring-white/50 shadow-sm"
                : "border-white/25 hover:border-white/60 opacity-70 hover:opacity-100"
            }`}
          />
        </div>

        {/* Card Body */}
        <div className='relative z-20 flex flex-col items-center justify-between h-full px-5 py-6 sm:px-7 sm:py-8'>
          
          {/* Top Orb Container */}
          <div className='relative mt-6 sm:mt-8 flex items-center justify-center'>
            <div
              className={`absolute inset-0 scale-[2.2] rounded-full blur-[70px] bg-gradient-to-r ${current.orb} opacity-50 transition-all duration-500`}
            />

            <div
              className={`relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br ${current.orb} shadow-[0_0_80px_rgba(255,255,255,0.2)] animate-pulse before:absolute before:inset-0 before:rounded-full before:bg-white/20 before:blur-lg`}
            />
          </div>

          {/* Center Text Section */}
          <div className='text-center space-y-2 max-w-[260px] sm:max-w-xs'>
            <h2 className={`font-bold text-lg sm:text-xl tracking-tight transition-colors duration-300 ${current.text}`}>
              Hello, I am AV AI
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed font-normal transition-colors duration-300 ${current.sub}`}>
              Your smart voice assistant.
              <br />
              Ask anything about your website.
            </p>
          </div>

          {/* Bottom Interactive Area */}
          <div className='flex flex-col items-center w-full gap-3 sm:gap-4'>
            {/* Listening Waveform */}
            <div className='flex items-center gap-1 h-6'>
              {isListening ? (
                <>
                  <span className={`w-1 rounded-full ${current.wave} animate-[bounce_1s_infinite_100ms] h-3`} />
                  <span className={`w-1 rounded-full ${current.wave} animate-[bounce_1s_infinite_300ms] h-5`} />
                  <span className={`w-1 rounded-full ${current.wave} animate-[bounce_1s_infinite_150ms] h-6`} />
                  <span className={`w-1 rounded-full ${current.wave} animate-[bounce_1s_infinite_400ms] h-4`} />
                  <span className={`w-1 rounded-full ${current.wave} animate-[bounce_1s_infinite_200ms] h-2`} />
                </>
              ) : (
                <span className={`text-[11px] font-medium tracking-wide uppercase ${current.sub}`}>
                  Ready to listen
                </span>
              )}
            </div>

            {/* Mic Toggle Button */}
            <button
              onClick={() => setIsListening(!isListening)}
              className={`relative group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all duration-300 cursor-pointer active:scale-95 ${current.button} ${current.micGlow}`}
              title={isListening ? "Mute Microphone" : "Unmute Microphone"}
            >
              {/* Mic Icon SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110 ${
                  theme === "neon" ? "text-black" : "text-white"
                }`}
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            </button>

            {/* Status Label */}
            <span className={`text-[11px] font-semibold tracking-wider uppercase transition-colors duration-300 ${current.listening}`}>
              {isListening ? "Listening..." : "Tap to speak"}
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}

export default AssistantPreview