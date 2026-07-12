
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Search } from "lucide-react";

export default function SettingsPage() {
  const roles = [
    { name: "Fleet Manager", dashboard: "✓", fleet: "✓", drivers: "✓", trips: "✓", maintenance: "✓", fuel: "✓", analytics: "✓" },
    { name: "Dispatcher", dashboard: "✓", fleet: "view", drivers: "-", trips: "✓", maintenance: "-", fuel: "-", analytics: "-" },
    { name: "Safety Officer", dashboard: "✓", fleet: "-", drivers: "✓", trips: "-", maintenance: "✓", fuel: "-", analytics: "-" },
    { name: "Financial Analyst", dashboard: "✓", fleet: "-", drivers: "-", trips: "-", maintenance: "-", fuel: "✓", analytics: "✓" },
  ];

  return (
    <>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Settings & RBAC</h2>
          <p className="text-slate-400">Manage user roles and permissions</p>
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
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* <Card className="lg:col-span-1 bg-slate-800/50 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">ADD USER</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-slate-300 text-sm">USERNAME</label>
              <input type="text" placeholder="john_doe" className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg py-2 px-3" />
            </div>
            <div className="space-y-2">
              <label className="text-slate-300 text-sm">ROLE</label>
              <select className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg py-2 px-3">
                <option>Fleet Manager</option>
                <option>Dispatcher</option>
                <option>Safety Officer</option>
                <option>Financial Analyst</option>
              </select>
            </div>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">Save Changes</Button>
          </CardContent>
        </Card> */}

        <Card className="lg:col-span-2 bg-slate-800/50 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">ROLE-BASED ACCESS (RBAC)</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left py-3 px-4">ROLE</th>
                  <th className="text-center py-3 px-4">DASHBOARD</th>
                  <th className="text-center py-3 px-4">FLEET</th>
                  <th className="text-center py-3 px-4">DRIVERS</th>
                  <th className="text-center py-3 px-4">TRIPS</th>
                  <th className="text-center py-3 px-4">MAINTENANCE</th>
                  <th className="text-center py-3 px-4">FUEL/EXP</th>
                  <th className="text-center py-3 px-4">ANALYTICS</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role, idx) => (
                  <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="py-3 px-4 text-slate-200 font-medium">{role.name}</td>
                    <td className="py-3 px-4 text-center text-green-400">{role.dashboard}</td>
                    <td className="py-3 px-4 text-center text-green-400">{role.fleet}</td>
                    <td className="py-3 px-4 text-center text-green-400">{role.drivers}</td>
                    <td className="py-3 px-4 text-center text-green-400">{role.trips}</td>
                    <td className="py-3 px-4 text-center text-green-400">{role.maintenance}</td>
                    <td className="py-3 px-4 text-center text-green-400">{role.fuel}</td>
                    <td className="py-3 px-4 text-center text-green-400">{role.analytics}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
