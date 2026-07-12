
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

export default function AnalyticsPage() {
  const monthlyData = [
    { month: "Jun", trips: 120, fuel: 8.2, cost: 15000 },
    { month: "Jul", trips: 180, fuel: 8.4, cost: 22000 },
  ];

  return (
    <>
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
    </>
  );
}
