
"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutDashboard, Truck, Users, Settings, BarChart3, Bell, Search, Plus } from "lucide-react"

export default function AnalyticsPage() {
  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, active: false, href: "/dashboard" },
    { label: "Fleet", icon: Truck, active: false, href: "/dashboard/fleet" },
    { label: "Drivers", icon: Users, active: false, href: "/dashboard/drivers" },
    { label: "Trips", icon: BarChart3, active: false, href: "/dashboard/trips" },
    { label: "Maintenance", icon: Settings, active: false, href: "/dashboard/maintenance" },
    { label: "Fuel & Expenses", icon: Settings, active: false, href: "/dashboard/fuel" },
    { label: "Analytics", icon: BarChart3, active: true, href: "/dashboard/analytics" },
    { label: "Settings", icon: Settings, active: false, href: "/dashboard/settings" },
  ]

  const monthlyData = [
    { month: "Jun", trips: 120, fuel: 8.2, cost: 15000 },
    { month: "Jul", trips: 180, fuel: 8.4, cost: 22000 },
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800/50 border-r border-purple-500/20 p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white tracking-wider">TransitOps</h1>
        </div>
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} passHref>
              <Button 
                variant="ghost" 
                className={`w-full justify-start gap-3 ${item.active ? "bg-purple-600/20 text-purple-300 border border-purple-500/30" : "text-slate-400 hover:text-white hover:bg-slate-700/50"}`}
              >
                <item.icon size={20} />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
        <div className="pt-4 border-t border-slate-700/50">
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-slate-700/50">
            <Users size={20} />
            Profile
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-slate-700/50">
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Reports & Analytics</h2>
            <p className="text-slate-400">View fleet performance metrics</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50">
              <Bell size={20} />
            </Button>
          </div>
        </header>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400">AVG. FUEL EFFICIENCY</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                8.4 km/l
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400">MONTHLY TRIPS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                180
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400">OPERATIONAL COST</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                ₹22,000
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400">AVG. RATING</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                4.8★
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Performance Bar Chart */}
        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">MONTHLY PERFORMANCE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4 h-48">
              <div className="flex flex-col items-center flex-1">
                <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg" style={{ height: "60%" }}></div>
                <div className="text-sm text-slate-400 mt-2">Jun</div>
                <div className="text-xs text-slate-500">120</div>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg" style={{ height: "90%" }}></div>
                <div className="text-sm text-slate-400 mt-2">Jul</div>
                <div className="text-xs text-slate-500">180</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
