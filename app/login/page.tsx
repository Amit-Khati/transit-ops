"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState<boolean | "indeterminate">(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = "Something went wrong";
        if (typeof data.error === "string") {
          errorMessage = data.error;
        } else if (typeof data.error === "object") {
          errorMessage = Object.values(data.error).flat().join(", ");
        }
        throw new Error(errorMessage);
      }

      // Store token in localStorage or cookies
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 antialiased selection:bg-yellow-500/30">
      {/* Left Column - Branding with High-Quality Background Image Overlay */}
      <div 
        className="relative md:w-1/2 text-white p-8 md:p-16 flex flex-col justify-between bg-cover bg-center overflow-hidden min-h-[40vh] md:min-h-screen"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop')` 
        }}
      >
        {/* Dark overlay mask to maintain contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-slate-800/85 z-0" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3 self-start backdrop-blur-md bg-slate-900/40 p-3 rounded-xl border border-slate-700/30 shadow-2xl">
          <div className="w-11 h-11 bg-gradient-to-br from-yellow-400 via-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
            <span className="text-slate-950 font-black text-xl tracking-tighter">T</span>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent">
              TransitOps
            </h1>
            <p className="text-xs text-slate-400 font-medium tracking-wide">Smart Transport Operations Platform</p>
          </div>
        </div>
        
        {/* Value Proposition Glassmorphism Card */}
        <div className="relative z-10 my-auto max-w-md backdrop-blur-xl bg-slate-950/40 p-8 rounded-2xl border border-slate-700/40 shadow-2xl mt-12 md:mt-0 transform transition-all duration-300 hover:border-slate-600/50">
          <h2 className="text-xl font-bold text-white mb-4 tracking-tight">Streamline Your Fleet Operations</h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            An enterprise-grade unified platform tailored specifically for complex modern logistics and multi-role coordinate workflows.
          </p>
          
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-yellow-400/90">One login, four core roles:</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Fleet Manager", desc: "Optimize assets" },
                { name: "Dispatcher", desc: "Real-time routing" },
                { name: "Safety Officer", desc: "Risk & compliance" },
                { name: "Financial Analyst", desc: "Cost analytics" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/60">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 mt-1.5 shrink-0 shadow-sm shadow-orange-400" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{item.name}</p>
                    <p className="text-[11px] text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Footer info */}
        <div className="relative z-10 text-[11px] text-slate-500 font-medium tracking-wide mt-8 md:mt-0">
          <p>© TransitOps © 2026 — Next-Gen Logistics Systems. All rights reserved.</p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="md:w-1/2 p-6 sm:p-12 md:p-16 flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/40 transform transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Sign in to your account</h2>
            <p className="text-sm text-slate-500 mt-1.5 font-medium">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs text-slate-700 font-bold tracking-wider uppercase">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Manager@TransitOps.in" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-yellow-500/20 focus-visible:border-orange-500 transition-all duration-200 h-10 px-3.5 rounded-lg font-medium shadow-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs text-slate-700 font-bold tracking-wider uppercase">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-yellow-500/20 focus-visible:border-orange-500 transition-all duration-200 h-10 px-3.5 rounded-lg font-medium shadow-sm"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2.5">
                <Checkbox 
                  id="remember" 
                  checked={remember}
                  onCheckedChange={setRemember}
                  className="border-slate-300 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-yellow-500 data-[state=checked]:to-orange-500 data-[state=checked]:border-orange-500 rounded transition-all duration-150"
                />
                <Label htmlFor="remember" className="text-sm text-slate-600 font-medium cursor-pointer select-none">
                  Remember me
                </Label>
              </div>
              <Link href="#" className="text-sm text-orange-600 hover:text-orange-700 font-bold transition-colors duration-150 hover:underline underline-offset-4">
                Forgot password?
              </Link>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-slate-950 font-bold h-11 rounded-lg transition-all duration-200 transform active:scale-[0.98] shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 mt-2 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* Access Mapping Segment */}
          <div className="mt-6 bg-slate-50 border border-slate-200/60 rounded-xl p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Access mapping by role:</p>
            <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-500 font-medium">
              <p><span className="text-slate-800 font-semibold">Fleet Manager</span> → Fleet, Maintenance</p>
              <p><span className="text-slate-800 font-semibold">Dispatcher</span> → Trips, Drivers</p>
              <p><span className="text-slate-800 font-semibold">Safety Officer</span> → Drivers, Compliance</p>
              <p><span className="text-slate-800 font-semibold">Financial Analyst</span> → Fuel & Expenses</p>
            </div>
          </div>
          
          <div className="mt-6 text-center border-t border-slate-100 pt-5">
            <p className="text-sm text-slate-500 font-medium">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-orange-600 hover:text-orange-700 font-bold transition-colors duration-150 underline underline-offset-4 decoration-2 decoration-orange-500/30 hover:decoration-orange-600">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}