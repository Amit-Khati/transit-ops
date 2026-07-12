"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LayoutDashboard,
  Truck,
  Users,
  TruckElectric,
  Wrench,
  Fuel,
  BarChart3,
  Settings,
  Bell,
  Search,
} from "lucide-react";

export default function DashboardPage() {
  const [selectedSection, setSelectedSection] = useState("dashboard");

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "fleet", label: "Fleet", icon: Truck },
    { id: "drivers", label: "Drivers", icon: Users },
    { id: "trips", label: "Trips", icon: TruckElectric },
    { id: "maintenance", label: "Maintenance", icon: Wrench },
    { id: "fuel", label: "Fuel & Expenses", icon: Fuel },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const dashboardContent = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: "Active Vehicles",
            value: "24",
            change: "+3 today",
            color: "from-blue-500 to-blue-600",
          },
          {
            title: "Drivers On Duty",
            value: "18",
            change: "+2 today",
            color: "from-green-500 to-green-600",
          },
          {
            title: "Trips Completed",
            value: "156",
            change: "+12 today",
            color: "from-purple-500 to-purple-600",
          },
          {
            title: "Avg Fuel Efficiency",
            value: "8.5 km/l",
            change: "+0.3 km/l",
            color: "from-orange-500 to-orange-600",
          },
        ].map((stat, idx) => (
          <Card key={idx} className="bg-slate-800/50 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-400">
                {stat.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div
                className={`text-sm font-medium bg-linear-to-r ${stat.color} bg-clip-text text-transparent`}
              >
                {stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-slate-800/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-slate-400">
              Latest updates from your fleet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                time: "2 mins ago",
                text: "Vehicle TRX-001 arrived at destination",
              },
              { time: "15 mins ago", text: "Driver John Doe started new trip" },
              { time: "1 hour ago", text: "Maintenance alert for TRX-005" },
              { time: "2 hours ago", text: "Fuel level low for TRX-012" },
            ].map((activity, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-3 rounded-lg bg-slate-700/30"
              >
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
            <Button className="w-full bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Add New Vehicle
            </Button>
            <Button
              variant="ghost"
              className="w-full text-slate-200 border border-slate-700 hover:bg-slate-700/50"
            >
              Assign Driver
            </Button>
            <Button
              variant="ghost"
              className="w-full text-slate-200 border border-slate-700 hover:bg-slate-700/50"
            >
              View Reports
            </Button>
            <Button
              variant="ghost"
              className="w-full text-slate-200 border border-slate-700 hover:bg-slate-700/50"
            >
              Schedule Maintenance
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const fleetContent = (
    <Card className="bg-slate-800/50 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white">Fleet Overview</CardTitle>
        <CardDescription className="text-slate-400">
          All active vehicles and current status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {[
          { name: "TRX-001", status: "In Transit", driver: "John Doe" },
          { name: "TRX-005", status: "Maintenance", driver: "Assigned" },
          { name: "TRX-012", status: "Idle", driver: "Available" },
        ].map((vehicle) => (
          <div
            key={vehicle.name}
            className="flex items-center justify-between rounded-lg bg-slate-700/30 p-4"
          >
            <div>
              <p className="text-white font-medium">{vehicle.name}</p>
              <p className="text-slate-400 text-sm">Driver: {vehicle.driver}</p>
            </div>
            <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-300">
              {vehicle.status}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const driversContent = (
    <Card className="bg-slate-800/50 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white">Drivers</CardTitle>
        <CardDescription className="text-slate-400">
          Manage driver assignments and availability
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {[
          { name: "John Doe", status: "On Duty", route: "Route 18" },
          { name: "Ava Smith", status: "Available", route: "Standby" },
          { name: "Michael Lee", status: "Off Duty", route: "Resting" },
        ].map((driver) => (
          <div
            key={driver.name}
            className="flex items-center justify-between rounded-lg bg-slate-700/30 p-4"
          >
            <div>
              <p className="text-white font-medium">{driver.name}</p>
              <p className="text-slate-400 text-sm">{driver.route}</p>
            </div>
            <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300">
              {driver.status}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const tripsContent = (
    <Card className="bg-slate-800/50 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white">Trips</CardTitle>
        <CardDescription className="text-slate-400">
          Current and recent trip activity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {[
          { trip: "TRP-2201", route: "Depot to Central", status: "Active" },
          { trip: "TRP-2198", route: "North Loop", status: "Completed" },
          { trip: "TRP-2197", route: "Airport Express", status: "Scheduled" },
        ].map((trip) => (
          <div
            key={trip.trip}
            className="flex items-center justify-between rounded-lg bg-slate-700/30 p-4"
          >
            <div>
              <p className="text-white font-medium">{trip.trip}</p>
              <p className="text-slate-400 text-sm">{trip.route}</p>
            </div>
            <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-300">
              {trip.status}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const maintenanceContent = (
    <Card className="bg-slate-800/50 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white">Maintenance</CardTitle>
        <CardDescription className="text-slate-400">
          Service alerts and upcoming work
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {[
          { item: "TRX-005 oil change", status: "Due today" },
          { item: "TRX-011 brake inspection", status: "Scheduled" },
          { item: "TRX-018 tire replacement", status: "Overdue" },
        ].map((task) => (
          <div
            key={task.item}
            className="flex items-center justify-between rounded-lg bg-slate-700/30 p-4"
          >
            <p className="text-white font-medium">{task.item}</p>
            <span className="rounded-full bg-orange-500/20 px-3 py-1 text-sm text-orange-300">
              {task.status}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const fuelContent = (
    <Card className="bg-slate-800/50 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white">Fuel & Expenses</CardTitle>
        <CardDescription className="text-slate-400">
          Track fuel usage and operating costs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {[
          { item: "Fuel spend this week", value: "$1,280" },
          { item: "Average cost per trip", value: "$42" },
          { item: "Idle fuel waste", value: "3.2%" },
        ].map((entry) => (
          <div
            key={entry.item}
            className="flex items-center justify-between rounded-lg bg-slate-700/30 p-4"
          >
            <p className="text-slate-200">{entry.item}</p>
            <p className="text-white font-semibold">{entry.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const analyticsContent = (
    <Card className="bg-slate-800/50 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white">Analytics</CardTitle>
        <CardDescription className="text-slate-400">
          Performance metrics and trends
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Utilization", value: "84%" },
          { title: "On-time Rate", value: "96%" },
          { title: "Incident Rate", value: "1.8%" },
        ].map((metric) => (
          <div key={metric.title} className="rounded-lg bg-slate-700/30 p-4">
            <p className="text-slate-400 text-sm">{metric.title}</p>
            <p className="text-3xl font-bold text-white mt-2">{metric.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const settingsContent = (
    <Card className="bg-slate-800/50 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white">Settings</CardTitle>
        <CardDescription className="text-slate-400">
          Update account and system preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {[
          "Profile settings",
          "Notifications",
          "Security & access",
          "System preferences",
        ].map((item) => (
          <div
            key={item}
            className="rounded-lg bg-slate-700/30 p-4 text-slate-200"
          >
            {item}
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const sectionContent: Record<string, React.ReactNode> = {
    dashboard: dashboardContent,
    fleet: fleetContent,
    drivers: driversContent,
    trips: tripsContent,
    maintenance: maintenanceContent,
    fuel: fuelContent,
    analytics: analyticsContent,
    settings: settingsContent,
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex">
      <aside className="w-64 bg-slate-800/50 border-r border-purple-500/20 p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white tracking-wider">
            TransitOps
          </h1>
        </div>
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => setSelectedSection(item.id)}
              className={`w-full justify-start gap-3 ${selectedSection === item.id ? "bg-purple-600/20 text-purple-300 border border-purple-500/30" : "text-slate-400 hover:text-white hover:bg-slate-700/50"}`}
            >
              <item.icon size={20} />
              {item.label}
            </Button>
          ))}
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

      <main className="flex-1 p-6">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {navItems.find((item) => item.id === selectedSection)?.label}
            </h2>
            <p className="text-slate-400">
              Here's the current section for your operations team.
            </p>
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
            <Button
              variant="ghost"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50"
            >
              <Bell size={20} />
            </Button>
            <div className="w-10 h-10 rounded-full bg-linear-to-r from-purple-500 to-blue-500 flex items-center justify-center font-semibold">
              JD
            </div>
          </div>
        </header>
        {sectionContent[selectedSection]}
      </main>
    </div>
  );
}
