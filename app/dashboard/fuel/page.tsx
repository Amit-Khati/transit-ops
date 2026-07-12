
"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutDashboard, Truck, Users, Settings, BarChart3, Bell, Search, Plus } from "lucide-react"

export default function FuelPage() {
  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, active: false, href: "/dashboard" },
    { label: "Fleet", icon: Truck, active: false, href: "/dashboard/fleet" },
    { label: "Drivers", icon: Users, active: false, href: "/dashboard/drivers" },
    { label: "Trips", icon: BarChart3, active: false, href: "/dashboard/trips" },
    { label: "Maintenance", icon: Settings, active: false, href: "/dashboard/maintenance" },
    { label: "Fuel & Expenses", icon: Settings, active: true, href: "/dashboard/fuel" },
    { label: "Analytics", icon: BarChart3, active: false, href: "/dashboard/analytics" },
    { label: "Settings", icon: Settings, active: false, href: "/dashboard/settings" },
  ]

  const fuelLogs = [
    { vehicle: "VAN-001", date: "08 Jul 2024", liters: "45 L", cost: "4,500" },
    { vehicle: "TRUCK-01", date: "06 Jul 2024", liters: "110 L", cost: "9,900" },
    { vehicle: "PICK-02", date: "04 Jul 2024", liters: "35 L", cost: "3,150" },
  ]

  const otherExpenses = [
    { type: "Toll", vehicle: "VAN-001", cost: "450", date: "08 Jul 2024", slipNo: "KA-T-2024-07-08" },
    { type: "Food", vehicle: "TRUCK-01", cost: "380", date: "06 Jul 2024", slipNo: "TRUCK-01-FOOD-07-06" },
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
            <h2 className="text-2xl font-bold text-white">Fuel & Expense Management</h2>
            <p className="text-slate-400">Track fuel and other expenses</p>
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
            <div className="flex gap-2">
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white flex items-center gap-2">
                <Plus size={18} />
                Log Fuel
              </Button>
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white flex items-center gap-2">
                <Plus size={18} />
                Add Expense
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fuel Logs */}
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">FUEL LOGS</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-700">
                    <th className="text-left py-3 px-4">VEHICLE</th>
                    <th className="text-left py-3 px-4">DATE</th>
                    <th className="text-left py-3 px-4">LITERS</th>
                    <th className="text-left py-3 px-4">COST</th>
                  </tr>
                </thead>
                <tbody>
                  {fuelLogs.map((log, idx) => (
                    <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="py-3 px-4 text-slate-200">{log.vehicle}</td>
                      <td className="py-3 px-4 text-slate-200">{log.date}</td>
                      <td className="py-3 px-4 text-slate-200">{log.liters}</td>
                      <td className="py-3 px-4 text-slate-200">₹{log.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Other Expenses */}
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">OTHER EXPENSES (TOLL / MEAL)</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-700">
                    <th className="text-left py-3 px-4">TYPE</th>
                    <th className="text-left py-3 px-4">VEHICLE</th>
                    <th className="text-left py-3 px-4">COST</th>
                    <th className="text-left py-3 px-4">SLIP NO.</th>
                    <th className="text-left py-3 px-4">DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {otherExpenses.map((expense, idx) => (
                    <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="py-3 px-4 text-slate-200">{expense.type}</td>
                      <td className="py-3 px-4 text-slate-200">{expense.vehicle}</td>
                      <td className="py-3 px-4 text-slate-200">₹{expense.cost}</td>
                      <td className="py-3 px-4 text-slate-200">{expense.slipNo}</td>
                      <td className="py-3 px-4 text-slate-200">{expense.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <Card className="mt-8 bg-slate-800/50 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">TOTAL OPERATIONAL COST (FUEL + MAINTENANCE + FUEL + MEAL)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-700/50">
                <div className="text-sm text-slate-400 mb-1">FUEL</div>
                <div className="text-2xl font-bold text-white">₹17,550</div>
              </div>
              <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-700/50">
                <div className="text-sm text-slate-400 mb-1">TOLL / MEAL</div>
                <div className="text-2xl font-bold text-white">₹830</div>
              </div>
              <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-700/50">
                <div className="text-sm text-slate-400 mb-1">MAINTENANCE</div>
                <div className="text-2xl font-bold text-white">₹27,500</div>
              </div>
              <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-700/50">
                <div className="text-sm text-slate-400 mb-1">TOTAL</div>
                <div className="text-2xl font-bold text-yellow-400">₹45,880</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
