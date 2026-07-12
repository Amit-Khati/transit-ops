import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-wider">
          Transit<span className="text-purple-400">Ops</span>
        </h1>
        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          Smart fleet management and transit operations platform. Streamline your logistics, track your vehicles, and manage your team all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login" passHref>
            <Button className="px-8 py-6 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold">
              Sign In
            </Button>
          </Link>
          <Link href="/signup" passHref>
            <Button variant="ghost" className="px-8 py-6 text-lg border border-slate-600 text-slate-200 hover:bg-slate-800/50 font-semibold">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
