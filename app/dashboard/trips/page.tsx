"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bell,
  Search,
  Plus,
  X,
  Edit,
  Trash2,
} from "lucide-react";

type Trip = {
  id: string;
  source: string;
  destination: string;
  cargoWeight: number;
  plannedDistance: number;
  actualDistance?: number;
  fuelConsumed?: number;
  revenue?: number;
  status: string;
  vehicleId: string;
  driverId: string;
  createdAt: string;
  updatedAt: string;
};

type TripFormData = {
  source: string;
  destination: string;
  cargoWeight: string;
  plannedDistance: string;
  actualDistance: string;
  fuelConsumed: string;
  revenue: string;
  status: string;
  vehicleId: string;
  driverId: string;
};

const initialFormData: TripFormData = {
  source: "",
  destination: "",
  cargoWeight: "",
  plannedDistance: "",
  actualDistance: "",
  fuelConsumed: "",
  revenue: "",
  status: "DRAFT",
  vehicleId: "",
  driverId: "",
};

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [formData, setFormData] = useState<TripFormData>(initialFormData);

  const fetchTrips = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/trips");
      if (!response.ok) {
        throw new Error("Failed to load trips");
      }
      const data = (await response.json()) as Trip[];
      setTrips(data);
      setSelectedTrip((current) => current ?? data[0] ?? null);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to load trips",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchTrips();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setSelectedTrip(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const openEditModal = (trip: Trip) => {
    setIsEditing(true);
    setSelectedTrip(trip);
    setFormData({
      source: trip.source,
      destination: trip.destination,
      cargoWeight: trip.cargoWeight.toString(),
      plannedDistance: trip.plannedDistance.toString(),
      actualDistance: trip.actualDistance?.toString() || "",
      fuelConsumed: trip.fuelConsumed?.toString() || "",
      revenue: trip.revenue?.toString() || "",
      status: trip.status,
      vehicleId: trip.vehicleId,
      driverId: trip.driverId,
    });
    setIsModalOpen(true);
  };

  const openViewModal = (trip: Trip) => {
    setIsEditing(false);
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormData);
    setIsEditing(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);

      const payload = {
        ...formData,
        cargoWeight: Number(formData.cargoWeight),
        plannedDistance: Number(formData.plannedDistance),
        actualDistance: formData.actualDistance
          ? Number(formData.actualDistance)
          : undefined,
        fuelConsumed: formData.fuelConsumed
          ? Number(formData.fuelConsumed)
          : undefined,
        revenue: formData.revenue ? Number(formData.revenue) : undefined,
      };

      const response = await fetch(
        isEditing && selectedTrip
          ? `/api/trips/${selectedTrip.id}`
          : "/api/trips",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Failed to save trip");
      }

      await fetchTrips();
      setSelectedTrip(result);
      closeModal();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to save trip",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this trip?");
    if (!confirmed) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/trips/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Failed to delete trip");
      }

      await fetchTrips();
      setSelectedTrip((current) => (current?.id === id ? null : current));
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete trip",
      );
    }
  };

  const filteredTrips = useMemo(() => {
    const query = searchText.toLowerCase();
    return trips.filter((trip) => {
      const matchesQuery =
        trip.source.toLowerCase().includes(query) ||
        trip.destination.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "All" || trip.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [trips, searchText, statusFilter]);

  const statusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
      case "DISPATCHED":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "COMPLETED":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "CANCELLED":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  return (
    <>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Trips Management</h2>
          <p className="text-slate-400">Track and manage all your trips</p>
        </div>
        <div className="flex items-center gap-4 flex-wrap justify-end">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search source or destination..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <Button
            variant="ghost"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50"
          >
            <Bell size={20} />
          </Button>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200"
          >
            <option value="All">Status: All</option>
            <option value="DRAFT">Draft</option>
            <option value="DISPATCHED">Dispatched</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <Button
            className="bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex items-center gap-2"
            onClick={openAddModal}
          >
            <Plus size={18} />
            Add Trip
          </Button>
        </div>
      </header>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Trips", value: trips.length },
              {
                label: "Dispatched",
                value: trips.filter((trip) => trip.status === "DISPATCHED").length,
              },
              {
                label: "Completed",
                value: trips.filter((trip) => trip.status === "COMPLETED").length,
              },
              {
                label: "Cancelled",
                value: trips.filter((trip) => trip.status === "CANCELLED").length,
              },
            ].map((item) => (
              <Card
                key={item.label}
                className="bg-slate-800/50 border-purple-500/20"
              >
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-white mb-1">
                    {item.value}
                  </div>
                  <div className="text-xs text-slate-400">{item.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-white">All Trips</CardTitle>
              <div className="text-sm text-slate-400">
                Showing {filteredTrips.length} records
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-10 text-center text-slate-400">
                  Loading trips...
                </div>
              ) : filteredTrips.length === 0 ? (
                <div className="py-10 text-center text-slate-400">
                  No trips found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400">
                        <th className="px-4 py-3 text-left">SOURCE</th>
                        <th className="px-4 py-3 text-left">DESTINATION</th>
                        <th className="px-4 py-3 text-left">CARGO (KG)</th>
                        <th className="px-4 py-3 text-left">PLANNED DIST (KM)</th>
                        <th className="px-4 py-3 text-left">ACTUAL DIST (KM)</th>
                        <th className="px-4 py-3 text-left">FUEL (L)</th>
                        <th className="px-4 py-3 text-left">REVENUE</th>
                        <th className="px-4 py-3 text-left">STATUS</th>
                        <th className="px-4 py-3 text-left">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTrips.map((trip) => (
                        <tr
                          key={trip.id}
                          className="border-b border-slate-700/50 hover:bg-slate-700/30"
                        >
                          <td className="py-3 px-4 text-slate-200">
                            {trip.source}
                          </td>
                          <td className="py-3 px-4 text-slate-200">
                            {trip.destination}
                          </td>
                          <td className="py-3 px-4 text-slate-200">
                            {trip.cargoWeight}
                          </td>
                          <td className="py-3 px-4 text-slate-200">
                            {trip.plannedDistance}
                          </td>
                          <td className="py-3 px-4 text-slate-200">
                            {trip.actualDistance || "-"}
                          </td>
                          <td className="py-3 px-4 text-slate-200">
                            {trip.fuelConsumed || "-"}
                          </td>
                          <td className="py-3 px-4 text-slate-200">
                            {trip.revenue ? `₹${trip.revenue}` : "-"}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-medium ${statusBadge(trip.status)}`}
                            >
                              {trip.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-blue-400 hover:text-blue-300"
                                onClick={() => openEditModal(trip)}
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-400 hover:text-red-300"
                                onClick={() => void handleDelete(trip.id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
          <Card className="w-full max-w-3xl border-purple-500/20 bg-slate-900 text-slate-200 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <CardTitle className="text-white">
                  {isEditing ? "Edit Trip" : "Add Trip"}
                </CardTitle>
                <p className="text-sm text-slate-400">
                  {isEditing ? "Update trip details" : "Create a new trip record"}
                </p>
              </div>
              <Button
                variant="ghost"
                className="p-2 text-slate-400 hover:text-white"
                onClick={closeModal}
              >
                <X size={18} />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
              >
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Source</label>
                  <input
                    required
                    value={formData.source}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        source: event.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                    placeholder="Mumbai"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Destination</label>
                  <input
                    required
                    value={formData.destination}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        destination: event.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                    placeholder="Delhi"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Cargo Weight (kg)</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={formData.cargoWeight}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        cargoWeight: event.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                    placeholder="500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Planned Distance (km)</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={formData.plannedDistance}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        plannedDistance: event.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                    placeholder="1400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Actual Distance (km)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.actualDistance}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        actualDistance: event.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                    placeholder="1420"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Fuel Consumed (L)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.fuelConsumed}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        fuelConsumed: event.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                    placeholder="200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Revenue</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.revenue}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        revenue: event.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                    placeholder="25000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Status</label>
                  <select
                    required
                    value={formData.status}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        status: event.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="DISPATCHED">Dispatched</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Vehicle ID</label>
                  <input
                    required
                    value={formData.vehicleId}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        vehicleId: event.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                    placeholder="Vehicle ID"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Driver ID</label>
                  <input
                    required
                    value={formData.driverId}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        driverId: event.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                    placeholder="Driver ID"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="border border-slate-700 text-slate-200 hover:bg-slate-700/50"
                    onClick={closeModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    {isSubmitting ? "Saving..." : isEditing ? "Update Trip" : "Save Trip"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
