
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Search, Plus, Trash2, Edit2 } from "lucide-react";

// Define types
type Maintenance = {
  id: string;
  vehicleId: string;
  title: string;
  description?: string;
  cost: number;
  status: "OPEN" | "CLOSED";
  openedAt: string;
  closedAt?: string;
  vehicle: {
    id: string;
    registrationNo: string;
    name: string;
    model?: string;
  };
};

type Vehicle = {
  id: string;
  registrationNo: string;
  name: string;
  model?: string;
};

export default function MaintenancePage() {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [formData, setFormData] = useState({
    vehicleId: "",
    title: "",
    description: "",
    cost: "",
    status: "OPEN" as const,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [maintenanceRes, vehiclesRes] = await Promise.all([
        fetch("/api/maintenance"),
        fetch("/api/fleet"),
      ]);
      const maintenanceData = await maintenanceRes.json();
      const vehiclesData = await vehiclesRes.json();
      setMaintenances(Array.isArray(maintenanceData) ? maintenanceData : []);
      setVehicles(Array.isArray(vehiclesData) ? vehiclesData.map((v: any) => ({
        id: v.id,
        registrationNo: v.regNo,
        name: v.nameModel.split(" / ")[0],
        model: v.nameModel.split(" / ")[1],
      })) : []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const payload = {
        vehicleId: formData.vehicleId,
        title: formData.title,
        description: formData.description,
        cost: Number(formData.cost),
        status: formData.status,
      };

      if (editingId) {
        await fetch(`/api/maintenance/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/maintenance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      await fetchData();
      resetForm();
    } catch (error) {
      console.error("Failed to save maintenance:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this maintenance record?")) return;
    try {
      await fetch(`/api/maintenance/${id}`, { method: "DELETE" });
      await fetchData();
    } catch (error) {
      console.error("Failed to delete maintenance:", error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      vehicleId: "",
      title: "",
      description: "",
      cost: "",
      status: "OPEN",
    });
    setEditingId(null);
  };

  // Filter records
  const filteredRecords = maintenances.filter((m) =>
    m.title.toLowerCase().includes(searchText.toLowerCase()) ||
    m.vehicle.registrationNo.toLowerCase().includes(searchText.toLowerCase())
  );

  // Status helpers
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CLOSED": return "bg-green-500/20 text-green-300 border-green-500/30";
      case "OPEN": return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      default: return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };
  const getStatusText = (status: string) => status === "CLOSED" ? "Completed" : "In Shop";

  // Stats
  const inShopCount = maintenances.filter(m => m.status === "OPEN").length;
  const completedCount = maintenances.filter(m => m.status === "CLOSED").length;
  const totalVehicles = vehicles.length;
  const availableCount = totalVehicles - inShopCount;

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
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
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
            <CardTitle className="text-white">
              {editingId ? "EDIT SERVICE RECORD" : "LOG SERVICE RECORD"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-slate-300 text-sm">VEHICLE</label>
                <select
                  required
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg py-2 px-3"
                >
                  <option value="">Select a vehicle</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>{v.registrationNo} - {v.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-slate-300 text-sm">SERVICE</label>
                <input
                  required
                  type="text"
                  placeholder="Oil Change"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg py-2 px-3"
                />
              </div>
              <div className="space-y-2">
                <label className="text-slate-300 text-sm">DESCRIPTION</label>
                <textarea
                  placeholder="Optional description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg py-2 px-3"
                />
              </div>
              <div className="space-y-2">
                <label className="text-slate-300 text-sm">COST</label>
                <input
                  required
                  type="number"
                  placeholder="2500"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg py-2 px-3"
                />
              </div>
              <div className="space-y-2">
                <label className="text-slate-300 text-sm">STATUS</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "OPEN" | "CLOSED" })}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg py-2 px-3"
                >
                  <option value="OPEN">In Shop</option>
                  <option value="CLOSED">Completed</option>
                </select>
              </div>
              <div className="flex gap-2">
                {editingId && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={resetForm}
                    className="flex-1 border border-slate-600"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">SERVICE LOG</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="py-10 text-center text-slate-400">Loading...</div>
            ) : filteredRecords.length === 0 ? (
              <div className="py-10 text-center text-slate-400">No records yet</div>
            ) : (
              filteredRecords.map((record) => (
                <div key={record.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-white">
                      {record.vehicle.registrationNo}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(record.status)}`}>
                        {getStatusText(record.status)}
                      </span>
                      <button
                        onClick={() => {
                          setEditingId(record.id);
                          setFormData({
                            vehicleId: record.vehicleId,
                            title: record.title,
                            description: record.description || "",
                            cost: String(record.cost),
                            status: record.status,
                          });
                        }}
                        className="p-1 text-blue-400 hover:text-blue-300"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-slate-400">
                    {new Date(record.openedAt).toLocaleDateString()} • {record.title} • ₹{record.cost.toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">Status Overview</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="w-32 text-sm text-slate-300">Available</div>
            <div className="h-2 bg-slate-700 flex-1 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${totalVehicles > 0 ? (availableCount / totalVehicles) * 100 : 0}%` }}
              ></div>
            </div>
            <div className="text-sm text-slate-300">{availableCount}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-32 text-sm text-slate-300">In Shop</div>
            <div className="h-2 bg-slate-700 flex-1 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500"
                style={{ width: `${totalVehicles > 0 ? (inShopCount / totalVehicles) * 100 : 0}%` }}
              ></div>
            </div>
            <div className="text-sm text-slate-300">{inShopCount}</div>
          </div>
        </div>
      </div>
    </>
  );
}
