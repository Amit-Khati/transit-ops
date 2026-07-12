
"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutDashboard, Truck, Users, Settings, BarChart3, Bell, Search } from "lucide-react"

export default function DashboardPage() {
  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, active: true, href: "/dashboard" },
    { label: "Fleet", icon: Truck, active: false, href: "/dashboard/fleet" },
    { label: "Drivers", icon: Users, active: false, href: "/dashboard/drivers" },
    { label: "Analytics", icon: BarChart3, active: false, href: "/dashboard/analytics" },
    { label: "Settings", icon: Settings, active: false, href: "/dashboard/settings" },
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
            <h2 className="text-2xl font-bold text-white">Welcome back!</h2>
            <p className="text-slate-400">Here's what's happening with your fleet today.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <Button variant="ghost" className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50">
              <Bell size={20} />
            </Button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center font-semibold">
              JD
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Active Vehicles", value: "24", change: "+3 today", color: "from-blue-500 to-blue-600" },
            { title: "Drivers On Duty", value: "18", change: "+2 today", color: "from-green-500 to-green-600" },
            { title: "Trips Completed", value: "156", change: "+12 today", color: "from-purple-500 to-purple-600" },
            { title: "Avg Fuel Efficiency", value: "8.5 km/l", change: "+0.3 km/l", color: "from-orange-500 to-orange-600" },
          ].map((stat, idx) => (
            <Card key={idx} className="bg-slate-800/50 border-purple-500/20">
              <CardHeader className="pb-2">
                <CardDescription className="text-slate-400">{stat.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className={`text-sm font-medium bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.change}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-slate-800/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-slate-400">Latest updates from your fleet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { time: "2 mins ago", text: "Vehicle TRX-001 arrived at destination" },
                { time: "15 mins ago", text: "Driver John Doe started new trip" },
                { time: "1 hour ago", text: "Maintenance alert for TRX-005" },
                { time: "2 hours ago", text: "Fuel level low for TRX-012" },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-start gap-4 p-3 rounded-lg bg-slate-700/30">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="text-slate-200 text-sm">{activity.text}</p>
                    <p className="text-slate-500 text-xs mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Add New Vehicle
              </Button>
              <Button variant="ghost" className="w-full text-slate-200 border border-slate-700 hover:bg-slate-700/50">
                Assign Driver
              </Button>
              <Button variant="ghost" className="w-full text-slate-200 border border-slate-700 hover:bg-slate-700/50">
                View Reports
              </Button>
              <Button variant="ghost" className="w-full text-slate-200 border border-slate-700 hover:bg-slate-700/50">
                Schedule Maintenance
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
