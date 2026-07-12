"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import seedVehicles from "./fleet-seed.json";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  LayoutDashboard,
  Truck,
  Users,
  Settings,
  BarChart3,
  Bell,
  Search,
  Plus,
  X,
  Edit,
  Trash2,
} from "lucide-react";

type Vehicle = {
  id: number;
  regNo: string;
  nameModel: string;
  type: string;
  capacity: string;
  odometer: string;
  acquisitionCost: string;
  status: string;
};

type VehicleFormData = {
  regNo: string;
  nameModel: string;
  type: string;
  capacity: string;
  odometer: string;
  acquisitionCost: string;
  status: string;
};

const initialFormData: VehicleFormData = {
  regNo: "",
  nameModel: "",
  type: "Van",
  capacity: "",
  odometer: "",
  acquisitionCost: "",
  status: "Available",
};

export default function FleetPage() {
  const navItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      active: false,
      href: "/dashboard",
    },
    { label: "Fleet", icon: Truck, active: true, href: "/dashboard/fleet" },
    {
      label: "Drivers",
      icon: Users,
      active: false,
      href: "/dashboard/drivers",
    },
    {
      label: "Trips",
      icon: BarChart3,
      active: false,
      href: "/dashboard/trips",
    },
    {
      label: "Maintenance",
      icon: Settings,
      active: false,
      href: "/dashboard/maintenance",
    },
    {
      label: "Fuel & Expenses",
      icon: Settings,
      active: false,
      href: "/dashboard/fuel",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      active: false,
      href: "/dashboard/analytics",
    },
    {
      label: "Settings",
      icon: Settings,
      active: false,
      href: "/dashboard/settings",
    },
  ];

  const [vehicles, setVehicles] = useState<Vehicle[]>(
    seedVehicles as Vehicle[],
  );
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [formData, setFormData] = useState<VehicleFormData>(initialFormData);

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/fleet");
      if (!response.ok) {
        throw new Error("Failed to load vehicles");
      }
      const data = (await response.json()) as Vehicle[];
      setVehicles(data.length > 0 ? data : (seedVehicles as Vehicle[]));
      setSelectedVehicle(
        (current) =>
          current ?? data[0] ?? (seedVehicles as Vehicle[])[0] ?? null,
      );
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to load vehicles",
      );
      setSelectedVehicle((seedVehicles as Vehicle[])[0] ?? null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchVehicles();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setSelectedVehicle(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setIsEditing(true);
    setSelectedVehicle(vehicle);
    setFormData({
      regNo: vehicle.regNo,
      nameModel: vehicle.nameModel,
      type: vehicle.type,
      capacity: vehicle.capacity,
      odometer: vehicle.odometer,
      acquisitionCost: vehicle.acquisitionCost,
      status: vehicle.status,
    });
    setIsModalOpen(true);
  };

  const openViewModal = (vehicle: Vehicle) => {
    setIsEditing(false);
    setSelectedVehicle(vehicle);
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
        odometer: Number(formData.odometer),
      };

      const response = await fetch(
        isEditing && selectedVehicle
          ? `/api/fleet/${selectedVehicle.id}`
          : "/api/fleet",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Failed to save vehicle");
      }

      await fetchVehicles();
      setSelectedVehicle(result);
      closeModal();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to save vehicle",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Delete this vehicle?");
    if (!confirmed) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/fleet/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Failed to delete vehicle");
      }

      await fetchVehicles();
      setSelectedVehicle((current) => (current?.id === id ? null : current));
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete vehicle",
      );
    }
  };

  const filteredVehicles = useMemo(() => {
    const query = searchText.toLowerCase();
    return vehicles.filter((vehicle) => {
      const matchesQuery =
        vehicle.regNo.toLowerCase().includes(query) ||
        vehicle.nameModel.toLowerCase().includes(query) ||
        vehicle.type.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "All" || vehicle.status === statusFilter;
      const matchesType = typeFilter === "All" || vehicle.type === typeFilter;
      return matchesQuery && matchesStatus && matchesType;
    });
  }, [vehicles, searchText, statusFilter, typeFilter]);

  const statusBadge = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "On Trip":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "In Shop":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      case "Retired":
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
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
            <Link key={item.label} href={item.href} passHref>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 ${item.active ? "bg-purple-600/20 text-purple-300 border border-purple-500/30" : "text-slate-400 hover:text-white hover:bg-slate-700/50"}`}
              >
                <item.icon size={20} />
                {item.label}
              </Button>
            </Link>
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
            <h2 className="text-2xl font-bold text-white">Fleet Management</h2>
            <p className="text-slate-400">
              Track vehicle inventory and operations
            </p>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-end">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search reg no, model, or type..."
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
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="In Shop">In Shop</option>
              <option value="Retired">Retired</option>
            </select>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200"
            >
              <option value="All">Type: All</option>
              <option value="Van">Van</option>
              <option value="Car">Car</option>
              <option value="Truck">Truck</option>
              <option value="Mini">Mini</option>
              <option value="Pickup">Pickup</option>
              <option value="Bus">Bus</option>
            </select>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
              onClick={openAddModal}
            >
              <Plus size={18} />
              Add Vehicle
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
                { label: "Total Vehicles", value: vehicles.length },
                {
                  label: "Available",
                  value: vehicles.filter(
                    (vehicle) => vehicle.status === "Available",
                  ).length,
                },
                {
                  label: "On Trip",
                  value: vehicles.filter(
                    (vehicle) => vehicle.status === "On Trip",
                  ).length,
                },
                {
                  label: "In Shop",
                  value: vehicles.filter(
                    (vehicle) => vehicle.status === "In Shop",
                  ).length,
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
                <CardTitle className="text-white">All Vehicles</CardTitle>
                <div className="text-sm text-slate-400">
                  Showing {filteredVehicles.length} records
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-10 text-center text-slate-400">
                    Loading vehicles...
                  </div>
                ) : filteredVehicles.length === 0 ? (
                  <div className="py-10 text-center text-slate-400">
                    No vehicles found.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700 text-slate-400">
                          <th className="px-4 py-3 text-left">REG. NO.</th>
                          <th className="px-4 py-3 text-left">NAME / MODEL</th>
                          <th className="px-4 py-3 text-left">TYPE</th>
                          <th className="px-4 py-3 text-left">CAPACITY</th>
                          <th className="px-4 py-3 text-left">ODOMETER</th>
                          <th className="px-4 py-3 text-left">ACQ. COST</th>
                          <th className="px-4 py-3 text-left">STATUS</th>
                          <th className="px-4 py-3 text-left">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVehicles.map((vehicle) => (
                          <tr
                            key={vehicle.id}
                            className={`border-b border-slate-700/50 hover:bg-slate-700/30 ${selectedVehicle?.id === vehicle.id ? "bg-slate-700/40" : ""}`}
                            onClick={() => openViewModal(vehicle)}
                          >
                            <td className="px-4 py-3 text-slate-200">
                              {vehicle.regNo}
                            </td>
                            <td className="px-4 py-3 text-slate-200">
                              {vehicle.nameModel}
                            </td>
                            <td className="px-4 py-3 text-slate-200">
                              {vehicle.type}
                            </td>
                            <td className="px-4 py-3 text-slate-200">
                              {vehicle.capacity}
                            </td>
                            <td className="px-4 py-3 text-slate-200">
                              {vehicle.odometer}
                            </td>
                            <td className="px-4 py-3 text-slate-200">
                              ₹{vehicle.acquisitionCost}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`rounded-full border px-3 py-1 text-xs font-medium ${statusBadge(vehicle.status)}`}
                              >
                                {vehicle.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-blue-400 hover:text-blue-300"
                                  onClick={(
                                    event: React.MouseEvent<HTMLButtonElement>,
                                  ) => {
                                    event.stopPropagation();
                                    openEditModal(vehicle);
                                  }}
                                >
                                  <Edit size={16} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-400 hover:text-red-300"
                                  onClick={(
                                    event: React.MouseEvent<HTMLButtonElement>,
                                  ) => {
                                    event.stopPropagation();
                                    void handleDelete(vehicle.id);
                                  }}
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
            <Card className="w-full max-w-4xl border-purple-500/20 bg-slate-900 text-slate-200 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <CardTitle className="text-white">
                    {isEditing ? "Edit Vehicle" : "Vehicle Details"}
                  </CardTitle>
                  <p className="text-sm text-slate-400">
                    {isEditing
                      ? "Update fleet inventory"
                      : "View vehicle details"}
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
                {isEditing ? (
                  <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 gap-4 md:grid-cols-2"
                  >
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">REG. No</label>
                      <input
                        required
                        value={formData.regNo}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            regNo: event.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                        placeholder="KA01AB1234"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">
                        Name / Model
                      </label>
                      <input
                        required
                        value={formData.nameModel}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            nameModel: event.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                        placeholder="Tata Ace Gold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Type</label>
                      <select
                        required
                        value={formData.type}
                        onChange={(event) =>
                          setFormData({ ...formData, type: event.target.value })
                        }
                        className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                      >
                        <option value="Van">Van</option>
                        <option value="Car">Car</option>
                        <option value="Truck">Truck</option>
                        <option value="Mini">Mini</option>
                        <option value="Pickup">Pickup</option>
                        <option value="Bus">Bus</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Capacity</label>
                      <input
                        required
                        value={formData.capacity}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            capacity: event.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                        placeholder="750 kg / 12 passengers"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Odometer</label>
                      <input
                        required
                        type="number"
                        min="0"
                        value={formData.odometer}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            odometer: event.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                        placeholder="45230"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">
                        Acquisition Cost
                      </label>
                      <input
                        required
                        value={formData.acquisitionCost}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            acquisitionCost: event.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                        placeholder="620000"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
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
                        <option value="Available">Available</option>
                        <option value="On Trip">On Trip</option>
                        <option value="In Shop">In Shop</option>
                        <option value="Retired">Retired</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 flex justify-end gap-3 pt-2">
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
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        {isSubmitting ? "Saving..." : "Update Vehicle"}
                      </Button>
                    </div>
                  </form>
                ) : selectedVehicle ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-lg bg-slate-700/30 p-4">
                        <div className="text-sm text-slate-400">
                          Registration
                        </div>
                        <div className="text-lg font-semibold text-white">
                          {selectedVehicle.regNo}
                        </div>
                      </div>
                      <div className="rounded-lg bg-slate-700/30 p-4">
                        <div className="text-sm text-slate-400">
                          Name / Model
                        </div>
                        <div className="text-lg font-semibold text-white">
                          {selectedVehicle.nameModel}
                        </div>
                      </div>
                      <div className="rounded-lg bg-slate-700/30 p-4">
                        <div className="text-sm text-slate-400">Type</div>
                        <div className="text-lg font-semibold text-white">
                          {selectedVehicle.type}
                        </div>
                      </div>
                      <div className="rounded-lg bg-slate-700/30 p-4">
                        <div className="text-sm text-slate-400">Capacity</div>
                        <div className="font-semibold text-white">
                          {selectedVehicle.capacity}
                        </div>
                      </div>
                      <div className="rounded-lg bg-slate-700/30 p-4">
                        <div className="text-sm text-slate-400">Odometer</div>
                        <div className="font-semibold text-white">
                          {selectedVehicle.odometer}
                        </div>
                      </div>
                      <div className="rounded-lg bg-slate-700/30 p-4">
                        <div className="text-sm text-slate-400">Acq. Cost</div>
                        <div className="font-semibold text-white">
                          ₹{selectedVehicle.acquisitionCost}
                        </div>
                      </div>
                      <div className="rounded-lg bg-slate-700/30 p-4 md:col-span-2">
                        <div className="text-sm text-slate-400">Status</div>
                        <div
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusBadge(selectedVehicle.status)}`}
                        >
                          {selectedVehicle.status}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        className="border border-slate-700 text-slate-200 hover:bg-slate-700/50"
                        onClick={closeModal}
                      >
                        Close
                      </Button>
                      <Button
                        type="button"
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={() => openEditModal(selectedVehicle)}
                      >
                        Edit Vehicle
                      </Button>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
