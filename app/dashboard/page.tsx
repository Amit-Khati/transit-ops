"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Topbar from "@/components/dashboard/Topbar";

export default function DashboardPage() {
  const recentTrips = [
    {
      tripId: "TRP001",
      vehicle: "VAN-001",
      driver: "Rajesh",
      status: "On Trip",
      eta: "45 min",
    },
    {
      tripId: "TRP002",
      vehicle: "TRUCK-01",
      driver: "Suresh",
      status: "Completed",
      eta: "-",
    },
    {
      tripId: "TRP003",
      vehicle: "PICK-02",
      driver: "Priya",
      status: "Dispatched",
      eta: "In 1hr",
    },
    {
      tripId: "TRP004",
      vehicle: "VAN-004",
      driver: "Amit",
      status: "Scheduled",
      eta: "Tomorrow",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "On Trip":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "Completed":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "Dispatched":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "Scheduled":
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  return (
    <>
      <Topbar />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-8">
        {[
          { title: "ACTIVE VEHICLES", value: "53", color: "border-blue-500" },
          {
            title: "AVAILABLE VEHICLES",
            value: "42",
            color: "border-green-500",
          },
          {
            title: "VEHICLES IN MAINTENANCE",
            value: "05",
            color: "border-orange-500",
          },
          { title: "ACTIVE TRIPS", value: "18", color: "border-blue-400" },
          { title: "PENDING TRIPS", value: "09", color: "border-yellow-400" },
          {
            title: "DRIVERS ON DUTY",
            value: "26",
            color: "border-purple-400",
          },
          {
            title: "FLEET UTILIZATION",
            value: "81%",
            color: "border-green-400",
          },
        ].map((stat, idx) => (
          <Card
            key={idx}
            className={`bg-slate-800/50 border-l-4 ${stat.color}`}
          >
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-slate-400">{stat.title}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Trips */}
        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">RECENT TRIPS</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left py-3 px-4">TRIP ID</th>
                  <th className="text-left py-3 px-4">VEHICLE</th>
                  <th className="text-left py-3 px-4">DRIVER</th>
                  <th className="text-left py-3 px-4">STATUS</th>
                  <th className="text-left py-3 px-4">ETA</th>
                </tr>
              </thead>
              <tbody>
                {recentTrips.map((trip, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-700/50 hover:bg-slate-700/30"
                  >
                    <td className="py-3 px-4 text-slate-200">
                      {trip.tripId}
                    </td>
                    <td className="py-3 px-4 text-slate-200">
                      {trip.vehicle}
                    </td>
                    <td className="py-3 px-4 text-slate-200">
                      {trip.driver}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(trip.status)}`}
                      >
                        {trip.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-200">{trip.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Vehicle Status Overview */}
        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">VEHICLE STATUS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { status: "Available", count: 42, color: "bg-green-500" },
              { status: "On Trip", count: 18, color: "bg-blue-500" },
              { status: "In Shop", count: 5, color: "bg-orange-500" },
              { status: "Routine", count: 3, color: "bg-yellow-500" },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-300">
                    {item.status}
                  </span>
                  <span className="text-sm text-slate-300">{item.count}</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color}`}
                    style={{ width: `${(item.count / 53) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
