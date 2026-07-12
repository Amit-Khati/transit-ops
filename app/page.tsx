"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div 
      className="relative min-h-screen flex items-center justify-center p-6 bg-cover bg-center overflow-hidden antialiased selection:bg-yellow-500/30"
      style={{ 
        backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop')` 
      }}
    >
      {/* Premium dark vignette overlay mask */}
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/95 to-slate-900/90 z-0" />

      <div className="relative z-10 max-w-5xl w-full text-center flex flex-col items-center">
        
        {/* Animated Brand Badge */}
        <div className="flex items-center gap-2.5 backdrop-blur-md bg-slate-900/50 p-2.5 px-4 rounded-full border border-slate-700/30 shadow-xl mb-8 animate-fade-in">
          <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-md flex items-center justify-center shadow-md">
            <span className="text-slate-950 font-black text-xs">T</span>
          </div>
          <span className="text-xs tracking-wider text-slate-300 font-bold uppercase">
            Logistics Management System v2026
          </span>
        </div>

        {/* Master Heading */}
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight max-w-3xl">
          Transit<span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">Ops</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          The unified, smart fleet management and transit operations platform. Streamline complex multi-role logistics workflows, optimize asset routing, and manage compliance all in one destination.
        </p>

        {/* Conversion CTA Group */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-sm sm:max-w-none mb-16">
          <Link href="/login" className="w-full sm:w-auto">
            <Button className="w-full sm:px-10 py-6 text-base bg-gradient-to-r from-yellow-500 via-orange-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-slate-950 font-bold rounded-xl transition-all duration-200 transform active:scale-[0.98] shadow-xl shadow-orange-500/10">
              Sign In to Terminal
            </Button>
          </Link>
          <Link href="/signup" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:px-10 py-6 text-base backdrop-blur-md bg-slate-950/20 border-slate-700/60 text-slate-100 hover:bg-slate-900/60 hover:text-white hover:border-slate-500 font-bold rounded-xl transition-all duration-200">
              Create Fleet Account
            </Button>
          </Link>
        </div>

        {/* Grid Displaying the 4 Roles to Boost Engagement */}
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {[
            { title: "Fleet Manager", role: "Optimize assets, reduce overheads, and maintain lifecycle control." },
            { title: "Dispatcher", role: "Coordinate real-time smart routing and immediate load assignments." },
            { title: "Safety Officer", role: "Enforce dynamic fleet risk mitigations and active compliance metrics." },
            { title: "Financial Analyst", role: "Deconstruct total fuel overheads and maximize expense transparency." }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="backdrop-blur-xl bg-slate-950/40 p-5 rounded-xl border border-slate-800/80 shadow-lg transform transition-all duration-300 hover:border-slate-700/60 hover:-translate-y-1 group"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-sm group-hover:scale-125 transition-transform" />
                <h3 className="text-sm font-bold tracking-tight text-slate-200 group-hover:text-yellow-400 transition-colors">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-normal font-medium">
                {item.role}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}