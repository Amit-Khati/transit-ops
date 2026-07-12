
"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LayoutDashboard, Truck, Users, Settings, BarChart3, Bell, Search, Plus, MapPin, Clock, Truck as TruckIcon, Users as UsersIcon } from "lucide-react"

export default function TripsPage() {
  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, active: false, href: "/dashboard" },
    { label: "Fleet", icon: Truck, active: false, href: "/dashboard/fleet" },
    { label: "Drivers", icon: Users, active: false, href: "/dashboard/drivers" },
    { label: "Trips", icon: BarChart3, active: true, href: "/dashboard/trips" },
    { label: "Maintenance", icon: Settings, active: false, href: "/dashboard/maintenance" },
    { label: "Fuel & Expenses", icon: Settings, active: false, href: "/dashboard/fuel" },
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
            <h2 className="text-2xl font-bold text-white">Trip Dispatcher</h2>
            <p className="text-slate-400">Dispatch new trips</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50">
              <Bell size={20} />
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trip Form */}
          <Card className="lg:col-span-2 bg-slate-800/50 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">CREATE TRIP</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">PICKUP LOCATION</label>
                  <Input placeholder="Warehouse A" className="bg-slate-700 border-slate-600 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">DROPOFF LOCATION</label>
                  <Input placeholder="Mumbai Industrial Depot" className="bg-slate-700 border-slate-600 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">ESTIMATED ARRIVAL</label>
                  <Input placeholder="Today, 3:00 PM" className="bg-slate-700 border-slate-600 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">DISTANCE</label>
                  <Input placeholder="150 km" className="bg-slate-700 border-slate-600 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-slate-300 text-sm">INSTRUCTIONS</label>
                <Input placeholder="Handle with care" className="bg-slate-700 border-slate-600 text-white" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">CARGO WEIGHT (KG)</label>
                  <Input placeholder="500" className="bg-slate-700 border-slate-600 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">SPECIAL INSTRUCTIONS</label>
                  <Input placeholder="None" className="bg-slate-700 border-slate-600 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assign Vehicle & Driver */}
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">ASSIGN</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-slate-300 text-sm">VEHICLE</label>
                <select className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg py-2 px-3">
                  <option>Van-001</option>
                  <option>Truck-01</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-slate-300 text-sm">DRIVER</label>
                <select className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg py-2 px-3">
                  <option>Rajesh Kumar</option>
                  <option>Suresh Singh</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-slate-300 text-sm">TRIP STATUS</label>
                <select className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg py-2 px-3">
                  <option>Dispatched</option>
                  <option>In Transit</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="ghost" className="flex-1 border border-slate-600 text-slate-300 hover:bg-slate-700/50">Cancel</Button>
                <Button className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">Dispatch Schedule</Button>
              </div>
              <div className="text-sm text-red-400 mt-2">
                🚫 Vehicle Capacity 500 kg<br/>
                🚫 Exceeds weight by 200 kg → Assign bigger vehicle
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trip Timeline */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">Trip Timeline</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs border border-green-500/30">
              <div className="w-2 h-2 rounded-full bg-green-400"></div> Trip Dispatched
            </div>
            <div className="h-0.5 bg-slate-600 flex-1"></div>
            <div className="flex items-center gap-1 bg-slate-700/50 text-slate-400 px-3 py-1 rounded-full text-xs border border-slate-600">
              <div className="w-2 h-2 rounded-full bg-slate-500"></div> In Transit
            </div>
            <div className="h-0.5 bg-slate-600 flex-1"></div>
            <div className="flex items-center gap-1 bg-slate-700/50 text-slate-400 px-3 py-1 rounded-full text-xs border border-slate-600">
              <div className="w-2 h-2 rounded-full bg-slate-500"></div> Completed
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
