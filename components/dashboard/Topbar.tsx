
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <p className="text-slate-400">Overview of fleet operations</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="border border-slate-700 text-slate-200 hover:bg-slate-700/50"
          >
            Vehicle Type: All
          </Button>
          <Button
            variant="ghost"
            className="border border-slate-700 text-slate-200 hover:bg-slate-700/50"
          >
            Status: All
          </Button>
          <Button
            variant="ghost"
            className="border border-slate-700 text-slate-200 hover:bg-slate-700/50"
          >
            Region: All
          </Button>
        </div>
        <Button
          variant="ghost"
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50"
        >
          <Bell size={20} />
        </Button>
      </div>
    </header>
  );
}
