
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Truck,
  Users,
  Settings,
  BarChart3,
  Wrench,
  Fuel,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    { label: "Fleet", icon: Truck, href: "/dashboard/fleet" },
    {
      label: "Drivers",
      icon: Users,
      href: "/dashboard/drivers",
    },
    {
      label: "Trips",
      icon: BarChart3,
      href: "/dashboard/trips",
    },
    {
      label: "Maintenance",
      icon: Wrench,
      href: "/dashboard/maintenance",
    },
    {
      label: "Fuel & Expenses",
      icon: Fuel,
      href: "/dashboard/fuel",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: "/dashboard/analytics",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
    },
  ];

  return (
    <aside className="w-64 bg-slate-800/50 border-r border-purple-500/20 p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-wider">
          TransitOps
        </h1>
      </div>
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href} passHref>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 ${
                  isActive
                    ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
      <div className="pt-4 border-t border-slate-700/50">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-slate-700/50"
        >
          <Users size={20} />
          Profile
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-slate-700/50"
        >
          Logout
        </Button>
      </div>
    </aside>
  );
}
