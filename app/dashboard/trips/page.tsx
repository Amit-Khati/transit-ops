"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type MouseEvent,
} from "react";
import Link from "next/link";
import seedTrips from "./trip-seed.json";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Bell,
  Search,
  Plus,
  X,
  Edit,
  Trash2,
  ArrowRightLeft,
} from "lucide-react";

type TripStatus = "DRAFT" | "DISPATCHED" | "COMPLETED" | "CANCELLED";

type Trip = {
  id: string;
  source: string;
  destination: string;
  cargoWeight: number;
  plannedDistance: number;
  actualDistance?: number | null;
  fuelConsumed?: number | null;
  revenue?: number | null;
  status: TripStatus;
  vehicleId: string;
  driverId: string;
  createdAt: string;
  updatedAt: string;
};

type VehicleOption = {
  id: string;
  regNo: string;
  nameModel: string;
};

type DriverOption = {
  id: string;
  name: string;
  username?: string;
};

type TripFormData = {
  source: string;
  destination: string;
  cargoWeight: string;
  plannedDistance: string;
  actualDistance: string;
  fuelConsumed: string;
  revenue: string;
  status: TripStatus;
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

const lifecycleOrder: TripStatus[] = [
  "DISPATCHED",
  "DRAFT",
  "COMPLETED",
  "CANCELLED",
];

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>(seedTrips as Trip[]);
  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);
  const [drivers, setDrivers] = useState<DriverOption[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(
    (seedTrips as Trip[])[0] ? (seedTrips as Trip[])[0] : null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [formData, setFormData] = useState<TripFormData>(initialFormData);

  const loadTrips = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/trips");
      if (!response.ok) {
        throw new Error("Failed to load trips");
      }

      const data = (await response.json()) as Trip[];
      const fallbackTrips = seedTrips as Trip[];
      const normalizedTrips = data.length > 0 ? data : fallbackTrips;
      setTrips(normalizedTrips);
      setSelectedTrip((current) =>
        current ? current : normalizedTrips[0] ? normalizedTrips[0] : null,
      );
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to load trips",
      );
      const fallbackTrips = seedTrips as Trip[];
      setTrips(fallbackTrips);
      setSelectedTrip((current) =>
        current ? current : fallbackTrips[0] ? fallbackTrips[0] : null,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadOptions = async () => {
    try {
      setIsLoadingOptions(true);
      const [vehicleResponse, driverResponse] = await Promise.all([
        fetch("/api/fleet"),
        fetch("/api/driver"),
      ]);

      const vehicleData = vehicleResponse.ok
        ? await vehicleResponse.json()
        : [];
      const driverData = driverResponse.ok ? await driverResponse.json() : [];

      setVehicles(
        Array.isArray(vehicleData)
          ? vehicleData.map((vehicle) => {
              const joinedName = [vehicle.name, vehicle.model]
                .filter(Boolean)
                .join(" / ");
              const registrationNo = vehicle.regNo
                ? vehicle.regNo
                : vehicle.registrationNo
                  ? vehicle.registrationNo
                  : "Unknown vehicle";
              const displayName = vehicle.nameModel
                ? vehicle.nameModel
                : joinedName
                  ? joinedName
                  : "Vehicle";
              return {
                id: String(vehicle.id),
                regNo: registrationNo,
                nameModel: displayName,
              };
            })
          : [],
      );

      setDrivers(
        Array.isArray(driverData)
          ? driverData.map((driver) => ({
              id: String(driver.id),
              name: driver.name ?? "Unknown driver",
              username: driver.username,
            }))
          : [],
      );
    } catch {
      setVehicles([]);
      setDrivers([]);
    } finally {
      setIsLoadingOptions(false);
    }
  };

  useEffect(() => {
    void loadTrips();
    void loadOptions();
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
      actualDistance: trip.actualDistance ? trip.actualDistance.toString() : "",
      fuelConsumed: trip.fuelConsumed ? trip.fuelConsumed.toString() : "",
      revenue: trip.revenue ? trip.revenue.toString() : "",
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

  const formatTripLabel = (
    id: string,
    items: { id: string; label: string }[],
  ) => {
    const match = items.find((item) => item.id === id);
    return match ? match.label : id;
  };

  const vehicleOptions = useMemo(
    () =>
      vehicles.map((vehicle) => ({
        id: vehicle.id,
        label: `${vehicle.regNo} - ${vehicle.nameModel}`,
      })),
    [vehicles],
  );

  const driverOptions = useMemo(
    () =>
      drivers.map((driver) => ({
        id: driver.id,
        label: driver.username
          ? `${driver.name} (${driver.username})`
          : driver.name,
      })),
    [drivers],
  );

  const sortedTrips = useMemo(
    () =>
      [...trips].sort(
        (left, right) =>
          new Date(right.createdAt).getTime() -
          new Date(left.createdAt).getTime(),
      ),
    [trips],
  );

  const filteredTrips = useMemo(() => {
    const query = searchText.toLowerCase();
    return sortedTrips.filter((trip) => {
      const vehicleLabel = formatTripLabel(trip.vehicleId, vehicleOptions);
      const driverLabel = formatTripLabel(trip.driverId, driverOptions);
      const matchesQuery =
        trip.source.toLowerCase().includes(query) ||
        trip.destination.toLowerCase().includes(query) ||
        vehicleLabel.toLowerCase().includes(query) ||
        driverLabel.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "All" || trip.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [sortedTrips, searchText, statusFilter, vehicleOptions, driverOptions]);

  const statusBadge = (status: TripStatus) => {
    switch (status) {
      case "DISPATCHED":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "DRAFT":
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
      case "COMPLETED":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "CANCELLED":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  const saveTrip = async (
    payload: Record<string, unknown>,
    method: "POST" | "PUT",
    endpoint: string,
  ) => {
    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error ? result.error : "Failed to save trip");
    }

    return result as Trip;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

      const savedTrip = await saveTrip(
        payload,
        isEditing && selectedTrip ? "PUT" : "POST",
        isEditing && selectedTrip
          ? `/api/trips/${selectedTrip.id}`
          : "/api/trips",
      );

      await loadTrips();
      setSelectedTrip(savedTrip);
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
        throw new Error(result.error ? result.error : "Failed to delete trip");
      }

      await loadTrips();
      setSelectedTrip((current) => (current?.id === id ? null : current));
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete trip",
      );
    }
  };

  const handleStatusUpdate = async (trip: Trip, nextStatus: TripStatus) => {
    try {
      setError(null);
      setIsSubmitting(true);

      const updatedTrip = await saveTrip(
        {
          source: trip.source,
          destination: trip.destination,
          cargoWeight: trip.cargoWeight,
          plannedDistance: trip.plannedDistance,
          actualDistance: trip.actualDistance ? trip.actualDistance : undefined,
          fuelConsumed: trip.fuelConsumed ? trip.fuelConsumed : undefined,
          revenue: trip.revenue ? trip.revenue : undefined,
          status: nextStatus,
          vehicleId: trip.vehicleId,
          driverId: trip.driverId,
        },
        "PUT",
        `/api/trips/${trip.id}`,
      );

      await loadTrips();
      setSelectedTrip(updatedTrip);
    } catch (statusError) {
      setError(
        statusError instanceof Error
          ? statusError.message
          : "Failed to update trip status",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableStatusActions = (status: TripStatus) => {
    if (status === "DRAFT") {
      return [
        { label: "Mark Completed", value: "COMPLETED" as TripStatus },
        { label: "Cancel Trip", value: "CANCELLED" as TripStatus },
      ];
    }

    if (status === "DISPATCHED") {
      return [
        { label: "Move to Draft", value: "DRAFT" as TripStatus },
        { label: "Cancel Trip", value: "CANCELLED" as TripStatus },
      ];
    }

    return [];
  };

  const tripsByStatus = useMemo(
    () =>
      lifecycleOrder.map((status) => ({
        status,
        count: trips.filter((trip) => trip.status === status).length,
      })),
    [trips],
  );

  return (
    <>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Trips Management</h2>
          <p className="text-slate-400">
            Dispatch, track, and close trip records from the backend
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
              placeholder="Search source, destination, vehicle, or driver..."
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
            <option value="DISPATCHED">Dispatched</option>
            <option value="DRAFT">Draft</option>
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

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        {tripsByStatus.map((item, index) => (
          <Card
            key={item.status}
            className={`border-purple-500/20 bg-slate-800/50 ${index === 0 ? "ring-1 ring-blue-500/30" : ""}`}
          >
            <CardContent className="pt-6">
              <div className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">
                {item.status}
              </div>
              <div className="text-3xl font-bold text-white">{item.count}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
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
                      <th className="px-4 py-3 text-left">VEHICLE</th>
                      <th className="px-4 py-3 text-left">DRIVER</th>
                      <th className="px-4 py-3 text-left">CARGO (KG)</th>
                      <th className="px-4 py-3 text-left">PLANNED DIST (KM)</th>
                      <th className="px-4 py-3 text-left">STATUS</th>
                      <th className="px-4 py-3 text-left">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTrips.map((trip) => (
                      <tr
                        key={trip.id}
                        className="cursor-pointer border-b border-slate-700/50 hover:bg-slate-700/30"
                        onClick={() => openViewModal(trip)}
                      >
                        <td className="px-4 py-3 text-slate-200">
                          {trip.source}
                        </td>
                        <td className="px-4 py-3 text-slate-200">
                          {trip.destination}
                        </td>
                        <td className="px-4 py-3 text-slate-200">
                          {formatTripLabel(trip.vehicleId, vehicleOptions)}
                        </td>
                        <td className="px-4 py-3 text-slate-200">
                          {formatTripLabel(trip.driverId, driverOptions)}
                        </td>
                        <td className="px-4 py-3 text-slate-200">
                          {trip.cargoWeight}
                        </td>
                        <td className="px-4 py-3 text-slate-200">
                          {trip.plannedDistance}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${statusBadge(trip.status)}`}
                          >
                            {trip.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-blue-400 hover:text-blue-300"
                              onClick={(
                                event: MouseEvent<HTMLButtonElement>,
                              ) => {
                                event.stopPropagation();
                                openEditModal(trip);
                              }}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-400 hover:text-red-300"
                              onClick={(
                                event: MouseEvent<HTMLButtonElement>,
                              ) => {
                                event.stopPropagation();
                                void handleDelete(trip.id);
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
          <Card className="w-full max-w-4xl border-purple-500/20 bg-slate-900 text-slate-200 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <CardTitle className="text-white">
                  {isEditing
                    ? "Edit Trip"
                    : selectedTrip
                      ? "Trip Details"
                      : "Add Trip"}
                </CardTitle>
                <p className="text-sm text-slate-400">
                  {isEditing
                    ? "Update the trip record"
                    : selectedTrip
                      ? "Review the trip and change its status when needed"
                      : "Create a new trip record"}
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
              {isEditing || !selectedTrip ? (
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
                        setFormData({ ...formData, source: event.target.value })
                      }
                      className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                      placeholder="Gandhinagar Depot"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">
                      Destination
                    </label>
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
                      placeholder="Ahmedabad Hub"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Vehicle</label>
                    <select
                      required
                      value={formData.vehicleId}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          vehicleId: event.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                      disabled={isLoadingOptions}
                    >
                      <option value="">
                        {isLoadingOptions
                          ? "Loading vehicles..."
                          : "Select a vehicle"}
                      </option>
                      {vehicleOptions.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Driver</label>
                    <select
                      required
                      value={formData.driverId}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          driverId: event.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                      disabled={isLoadingOptions}
                    >
                      <option value="">
                        {isLoadingOptions
                          ? "Loading drivers..."
                          : "Select a driver"}
                      </option>
                      {driverOptions.map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">
                      Cargo Weight (kg)
                    </label>
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
                    <label className="text-sm text-slate-300">
                      Planned Distance (km)
                    </label>
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
                      placeholder="140"
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
                          status: event.target.value as TripStatus,
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
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm text-slate-300">
                      Optional Progress Details
                    </label>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                        placeholder="Actual distance"
                      />
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
                        placeholder="Fuel consumed"
                      />
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
                        placeholder="Revenue"
                      />
                    </div>
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
                      {isSubmitting
                        ? "Saving..."
                        : isEditing
                          ? "Update Trip"
                          : "Save Trip"}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {[
                      ["Source", selectedTrip.source],
                      ["Destination", selectedTrip.destination],
                      [
                        "Vehicle",
                        formatTripLabel(selectedTrip.vehicleId, vehicleOptions),
                      ],
                      [
                        "Driver",
                        formatTripLabel(selectedTrip.driverId, driverOptions),
                      ],
                      ["Cargo Weight", `${selectedTrip.cargoWeight} kg`],
                      [
                        "Planned Distance",
                        `${selectedTrip.plannedDistance} km`,
                      ],
                      [
                        "Actual Distance",
                        selectedTrip.actualDistance
                          ? `${selectedTrip.actualDistance} km`
                          : "Pending",
                      ],
                      [
                        "Fuel Consumed",
                        selectedTrip.fuelConsumed
                          ? `${selectedTrip.fuelConsumed} L`
                          : "Pending",
                      ],
                      [
                        "Revenue",
                        selectedTrip.revenue
                          ? `₹${selectedTrip.revenue}`
                          : "Pending",
                      ],
                      ["Status", selectedTrip.status],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-xl border border-slate-800 bg-slate-800/60 p-4"
                      >
                        <div className="text-xs uppercase tracking-[0.25em] text-slate-500 mb-2">
                          {label}
                        </div>
                        <div className="text-sm font-medium text-white">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4">
                    <div className="text-xs uppercase tracking-[0.25em] text-slate-500 mb-3">
                      Tracking Order
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                      {lifecycleOrder.map((status) => (
                        <div
                          key={status}
                          className={`rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${status === selectedTrip.status ? statusBadge(status) : "border-slate-700 text-slate-400"}`}
                        >
                          {status}
                        </div>
                      ))}
                    </div>
                  </div>

                  {availableStatusActions(selectedTrip.status).length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {availableStatusActions(selectedTrip.status).map(
                        (action) => (
                          <Button
                            key={action.value}
                            disabled={isSubmitting}
                            className="bg-slate-700 text-white hover:bg-slate-600"
                            onClick={() =>
                              void handleStatusUpdate(
                                selectedTrip,
                                action.value,
                              )
                            }
                          >
                            <ArrowRightLeft size={16} className="mr-2" />
                            {action.label}
                          </Button>
                        ),
                      )}
                    </div>
                  )}

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
                      className="bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      onClick={() => openEditModal(selectedTrip)}
                    >
                      Edit Trip
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
