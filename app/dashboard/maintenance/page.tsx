
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Search, Plus } from "lucide-react";

export default function MaintenancePage() {
  const records = [
    { date: "2024-07-10", vehicle: "VAN-001", service: "Oil Change", cost: "2,500", status: "Completed" },
    { date: "2024-07-08", vehicle: "TRUCK-01", service: "Engine Repair", cost: "18,500", status: "In Shop" },
    { date: "2024-07-05", vehicle: "PICK-02", service: "Tyre Replace", cost: "6,500", status: "In Shop" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-500/20 text-green-300 border-green-500/30";
      case "In Shop": return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      default: return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  return (
    <>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Maintenance</h2>
          <p className="text-slate-400">Track vehicle service records</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">LOG SERVICE RECORD</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-slate-300 text-sm">DATE</label>
              <input type="date" className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg py-2 px-3" />
            </div>
            <div className="space-y-2">
              <label className="text-slate-300 text-sm">VEHICLE</label>
              <select className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg py-2 px-3">
                <option>VAN-001</option>
                <option>TRUCK-01</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-slate-300 text-sm">SERVICE</label>
              <input type="text" placeholder="Oil Change" className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg py-2 px-3" />
            </div>
            <div className="space-y-2">
              <label className="text-slate-300 text-sm">COST</label>
              <input type="number" placeholder="2500" className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg py-2 px-3" />
            </div>
            <div className="space-y-2">
              <label className="text-slate-300 text-sm">STATUS</label>
              <select className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg py-2 px-3">
                <option>In Shop</option>
                <option>Completed</option>
              </select>
            </div>
            <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">Save</Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">SERVICE LOG</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {records.map((record, idx) => (
              <div key={idx} className="p-4 bg-slate-700/30 rounded-lg border border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-white">{record.vehicle}</div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(record.status)}`}>
                    {record.status}
                  </span>
                </div>
                <div className="text-sm text-slate-400">
                  {record.date} • {record.service} • ₹{record.cost}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">Status Overview</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="w-32 text-sm text-slate-300">Available</div>
            <div className="h-2 bg-slate-700 flex-1 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-1/2"></div>
            </div>
            <div className="text-sm text-slate-300">In Shop</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-32 text-sm text-slate-300">In Shop</div>
            <div className="h-2 bg-slate-700 flex-1 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 w-1/4"></div>
            </div>
            <div className="text-sm text-slate-300">Available</div>
          </div>
          <div className="text-xs text-orange-400 mt-2">
            Note: In shop 3+ days, remove free (or free for Repo, part)
          </div>
        </div>
      </div>
    </>
  );
}
