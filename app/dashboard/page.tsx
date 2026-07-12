"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Topbar from "@/components/dashboard/Topbar";

// Define types
type Trip = {
  id: string;
  source: string;
  destination: string;
  status: "DRAFT" | "DISPATCHED" | "COMPLETED" | "CANCELLED";
  vehicleId: string;
  driverId: string;
};

type Vehicle = {
  id: string;
  regNo: string;
  nameModel: string;
  status: "Available" | "On Trip" | "In Shop" | "Retired";
};

type Driver = {
  id: string;
  name: string;
};

export default function DashboardPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from APIs
  const fetchData = async () => {
    try {
      const [tripsRes, vehiclesRes, driversRes] = await Promise.all([
        fetch("/api/trips"),
        fetch("/api/fleet"),
        fetch("/api/driver"),
      ]);
      
      const tripsData = await tripsRes.json();
      const vehiclesData = await vehiclesRes.json();
      const driversData = await driversRes.json();
      
      setTrips(Array.isArray(tripsData) ? tripsData : []);
      setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
      setDrivers(Array.isArray(driversData) ? driversData : []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and then poll every 5 seconds for real-time updates
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Helper functions
  const getDriverName = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver ? driver.name : "Unknown";
  };

  const getVehicleRegNo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? vehicle.regNo : "Unknown";
  };

  const getTripStatusBadge = (status: string) => {
    switch (status) {
      case "DISPATCHED":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "COMPLETED":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "DRAFT":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "CANCELLED":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  const getTripStatusText = (status: string) => {
    switch (status) {
      case "DISPATCHED":
        return "On Trip";
      case "COMPLETED":
        return "Completed";
      case "DRAFT":
        return "Scheduled";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
    }
  };

  // Calculate stats
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter(v => v.status === "Available").length;
  const vehiclesInMaintenance = vehicles.filter(v => v.status === "In Shop").length;
  const activeTrips = trips.filter(t => t.status === "DISPATCHED").length;
  const pendingTrips = trips.filter(t => t.status === "DRAFT").length;
  const driversOnDuty = drivers.length;
  const fleetUtilization = totalVehicles > 0 ? Math.round((activeTrips / totalVehicles) * 100) : 0;

  // Get recent trips (last 5)
  const recentTrips = trips.slice(0, 5);

  // Vehicle status counts
  const vehicleStatusCounts = {
    Available: availableVehicles,
    "On Trip": activeTrips,
    "In Shop": vehiclesInMaintenance,
    Retired: vehicles.filter(v => v.status === "Retired").length,
  };

  return (
    <>
      <Topbar />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-8">
        {[
          { title: "ACTIVE VEHICLES", value: totalVehicles, color: "border-blue-500" },
          { title: "AVAILABLE VEHICLES", value: availableVehicles, color: "border-green-500" },
          { title: "VEHICLES IN MAINTENANCE", value: vehiclesInMaintenance, color: "border-orange-500" },
          { title: "ACTIVE TRIPS", value: activeTrips, color: "border-blue-400" },
          { title: "PENDING TRIPS", value: pendingTrips, color: "border-yellow-400" },
          { title: "DRIVERS ON DUTY", value: driversOnDuty, color: "border-purple-400" },
          { title: "FLEET UTILIZATION", value: `${fleetUtilization}%`, color: "border-green-400" },
        ].map((stat, idx) => (
          <Card key={idx} className={`bg-slate-800/50 border-l-4 ${stat.color}`}>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-white mb-1">
                {loading ? "..." : stat.value}
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
            {loading ? (
              <div className="py-10 text-center text-slate-400">Loading trips...</div>
            ) : recentTrips.length === 0 ? (
              <div className="py-10 text-center text-slate-400">No trips yet</div>
            ) : (
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
                  {recentTrips.map((trip) => (
                    <tr
                      key={trip.id}
                      className="border-b border-slate-700/50 hover:bg-slate-700/30"
                    >
                      <td className="py-3 px-4 text-slate-200">{trip.id.slice(0, 8).toUpperCase()}</td>
                      <td className="py-3 px-4 text-slate-200">{getVehicleRegNo(trip.vehicleId)}</td>
                      <td className="py-3 px-4 text-slate-200">{getDriverName(trip.driverId)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getTripStatusBadge(trip.status)}`}
                        >
                          {getTripStatusText(trip.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-200">-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        {/* Vehicle Status Overview */}
        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">VEHICLE STATUS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="py-10 text-center text-slate-400">Loading vehicles...</div>
            ) : (
              Object.entries(vehicleStatusCounts).map(([status, count], idx) => {
                const color = status === "Available" ? "bg-green-500" 
                  : status === "On Trip" ? "bg-blue-500" 
                  : status === "In Shop" ? "bg-orange-500" 
                  : "bg-yellow-500";
                
                return (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-300">{status}</span>
                      <span className="text-sm text-slate-300">{count}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color}`}
                        style={{ width: `${totalVehicles > 0 ? (count / totalVehicles) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
