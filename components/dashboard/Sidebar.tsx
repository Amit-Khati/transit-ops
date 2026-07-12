
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Truck,
  Users,
  Settings,
  BarChart3,
  Wrench,
  Fuel,
  X,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  const confirmLogout = () => {
    setShowConfirmDialog(true);
  };

  const cancelLogout = () => {
    setShowConfirmDialog(false);
  };

  const proceedLogout = () => {
    setShowConfirmDialog(false);
    handleLogout();
  };

  return (
    <>
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
            onClick={confirmLogout}
            disabled={isLoggingOut}
            className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-950/30 bg-red-950/10"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </aside>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4">
        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 w-full max-w-md shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Confirm Logout</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={cancelLogout}
              className="text-slate-400 hover:text-white"
            >
              <X size={20} />
            </Button>
          </div>
          <p className="text-slate-400 mb-6">
            Are you sure you want to log out of your account?
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={cancelLogout}
              className="border border-slate-700 text-slate-200 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              onClick={proceedLogout}
              disabled={isLoggingOut}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoggingOut ? "Logging out..." : "Yes, Logout"}
            </Button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
