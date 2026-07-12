
"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutDashboard, Truck, Users, Settings, BarChart3, Bell, Search, Plus } from "lucide-react"

export default function DriversPage() {
  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, active: false, href: "/dashboard" },
    { label: "Fleet", icon: Truck, active: false, href: "/dashboard/fleet" },
    { label: "Drivers", icon: Users, active: true, href: "/dashboard/drivers" },
    { label: "Trips", icon: BarChart3, active: false, href: "/dashboard/trips" },
    { label: "Maintenance", icon: Settings, active: false, href: "/dashboard/maintenance" },
    { label: "Fuel & Expenses", icon: Settings, active: false, href: "/dashboard/fuel" },
    { label: "Analytics", icon: BarChart3, active: false, href: "/dashboard/analytics" },
    { label: "Settings", icon: Settings, active: false, href: "/dashboard/settings" },
  ]

  const drivers = [
    { name: "Rajesh Kumar", license: "DL-12-CD-2024", contact: "9876543210", joinDate: "12/03/2024", trips: "145", rating: "4.8", status: "Available" },
    { name: "Suresh Singh", license: "KA-01-EF-2023", contact: "9876543211", joinDate: "15/06/2023", trips: "320", rating: "4.9", status: "Suspended" },
    { name: "Priya Sharma", license: "TN-09-GH-2022", contact: "9876543212", joinDate: "04/09/2022", trips: "420", rating: "4.7", status: "On Trip" },
    { name: "Amit Patel", license: "MH-02-IJ-2021", contact: "9876543213", joinDate: "01/01/2021", trips: "890", rating: "5.0", status: "Off Duty" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Available": return "bg-green-500/20 text-green-300 border-green-500/30"
      case "On Trip": return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "Suspended": return "bg-red-500/20 text-red-300 border-red-500/30"
      case "Off Duty": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      default: return "bg-slate-500/20 text-slate-300 border-slate-500/30"
    }
  }

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
            <h2 className="text-2xl font-bold text-white">Drivers & Safety Profiles</h2>
            <p className="text-slate-400">Manage your driver team</p>
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
            <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white flex items-center gap-2">
              <Plus size={18} />
              Add Driver
            </Button>
          </div>
        </header>

        {/* Driver Table */}
        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">All Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-700">
                    <th className="text-left py-3 px-4">NAME</th>
                    <th className="text-left py-3 px-4">LICENSE NO.</th>
                    <th className="text-left py-3 px-4">CONTACT</th>
                    <th className="text-left py-3 px-4">JOIN DATE</th>
                    <th className="text-left py-3 px-4">TRIPS COMPL.</th>
                    <th className="text-left py-3 px-4">RATING</th>
                    <th className="text-left py-3 px-4">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((driver, idx) => (
                    <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="py-3 px-4 text-slate-200">{driver.name}</td>
                      <td className="py-3 px-4 text-slate-200">{driver.license}</td>
                      <td className="py-3 px-4 text-slate-200">{driver.contact}</td>
                      <td className="py-3 px-4 text-slate-200">{driver.joinDate}</td>
                      <td className="py-3 px-4 text-slate-200">{driver.trips}</td>
                      <td className="py-3 px-4 text-slate-200">{driver.rating}★</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(driver.status)}`}>
                          {driver.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-orange-400">
              Note: Record time or Suspended related - Must have free space are free for Trip Dispatcher
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
