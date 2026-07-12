"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Search, Plus, Edit, Trash2 } from "lucide-react";

type FuelLog = {
  id: string;
  vehicleId: string;
  vehicle: string;
  date: string;
  liters: string;
  cost: string;
};

type Expense = {
  id: string;
  tripId?: string;
  tripLabel?: string;
  vehicleId: string;
  vehicle: string;
  type: string;
  amount: string;
  description?: string;
  date: string;
};

type VehicleOption = {
  id: string;
  label: string;
};

type TripOption = {
  id: string;
  label: string;
};

const emptyFuelForm = {
  vehicleId: "",
  date: "",
  liters: "",
  cost: "",
};

const emptyExpenseForm = {
  type: "Toll",
  tripId: "",
  vehicleId: "",
  amount: "",
  description: "",
  date: "",
};

export default function FuelPage() {
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [otherExpenses, setOtherExpenses] = useState<Expense[]>([]);
  const [fleetOptions, setFleetOptions] = useState<VehicleOption[]>([]);
  const [tripOptions, setTripOptions] = useState<TripOption[]>([]);
  const [isFuelFormOpen, setIsFuelFormOpen] = useState(false);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  const [editingFuel, setEditingFuel] = useState<FuelLog | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [fuelFormData, setFuelFormData] = useState(emptyFuelForm);
  const [expenseFormData, setExpenseFormData] = useState(emptyExpenseForm);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setError(null);
      const [fuelResponse, expenseResponse, fleetResponse, tripResponse] =
        await Promise.all([
          fetch("/api/fuel"),
          fetch("/api/expenses"),
          fetch("/api/fleet"),
          fetch("/api/trips"),
        ]);

      if (
        !fuelResponse.ok ||
        !expenseResponse.ok ||
        !fleetResponse.ok ||
        !tripResponse.ok
      ) {
        throw new Error("Failed to load fuel and expense data");
      }

      const fuelData = (await fuelResponse.json()) as FuelLog[];
      const expenseData = (await expenseResponse.json()) as Expense[];
      const fleetData = (await fleetResponse.json()) as Array<{
        id: string;
        nameModel?: string;
        regNo?: string;
      }>;
      const tripData = (await tripResponse.json()) as Array<{
        id: string;
        source: string;
        destination: string;
      }>;

      setFuelLogs(fuelData);
      setOtherExpenses(expenseData);
      setFleetOptions(
        fleetData.map((vehicle) => ({
          id: vehicle.id,
          label: vehicle.nameModel || vehicle.regNo || vehicle.id,
        })),
      );
      setTripOptions(
        tripData.map((trip) => ({
          id: trip.id,
          label: `${trip.source} → ${trip.destination}`,
        })),
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load fuel and expense data",
      );
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const fuelCostTotal = useMemo(
    () => fuelLogs.reduce((sum, log) => sum + Number(log.cost || 0), 0),
    [fuelLogs],
  );

  const tollTotal = useMemo(
    () =>
      otherExpenses
        .filter((expense) => expense.type === "Toll")
        .reduce((sum, expense) => sum + Number(expense.amount || 0), 0),
    [otherExpenses],
  );

  const maintenanceTotal = useMemo(
    () =>
      otherExpenses
        .filter((expense) => expense.type === "Maintenance")
        .reduce((sum, expense) => sum + Number(expense.amount || 0), 0),
    [otherExpenses],
  );

  const miscTotal = useMemo(
    () =>
      otherExpenses
        .filter((expense) => expense.type === "Other")
        .reduce((sum, expense) => sum + Number(expense.amount || 0), 0),
    [otherExpenses],
  );

  const totalOperationalCost =
    fuelCostTotal + tollTotal + maintenanceTotal + miscTotal;

  const handleAddFuel = () => {
    setEditingFuel(null);
    setFuelFormData(emptyFuelForm);
    setIsFuelFormOpen(true);
  };

  const handleEditFuel = (log: FuelLog) => {
    setEditingFuel(log);
    setFuelFormData({
      vehicleId: log.vehicleId,
      date: log.date,
      liters: log.liters.replace(" L", ""),
      cost: log.cost,
    });
    setIsFuelFormOpen(true);
  };

  const handleDeleteFuel = async (id: string) => {
    try {
      setIsBusy(true);
      const response = await fetch(`/api/fuel/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete fuel log");
      }
      await loadData();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete fuel log",
      );
    } finally {
      setIsBusy(false);
    }
  };

  const handleFuelSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIsBusy(true);
      const payload = {
        vehicleId: fuelFormData.vehicleId,
        date: fuelFormData.date,
        liters: Number(fuelFormData.liters),
        cost: Number(fuelFormData.cost),
      };

      const response = editingFuel
        ? await fetch(`/api/fuel/${editingFuel.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/fuel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (!response.ok) {
        throw new Error("Failed to save fuel log");
      }

      await loadData();
      setIsFuelFormOpen(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to save fuel log",
      );
    } finally {
      setIsBusy(false);
    }
  };

  const handleAddExpense = () => {
    setEditingExpense(null);
    setExpenseFormData(emptyExpenseForm);
    setIsExpenseFormOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setExpenseFormData({
      type: expense.type,
      tripId: expense.tripId || "",
      vehicleId: expense.vehicleId,
      amount: expense.amount,
      description: expense.description || "",
      date: expense.date,
    });
    setIsExpenseFormOpen(true);
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      setIsBusy(true);
      const response = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }
      await loadData();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete expense",
      );
    } finally {
      setIsBusy(false);
    }
  };

  const handleExpenseSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIsBusy(true);
      const payload = {
        tripId: expenseFormData.tripId,
        vehicleId: expenseFormData.vehicleId,
        type: expenseFormData.type,
        amount: Number(expenseFormData.amount),
        description: expenseFormData.description,
        date: expenseFormData.date,
      };

      const response = editingExpense
        ? await fetch(`/api/expenses/${editingExpense.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/expenses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (!response.ok) {
        throw new Error("Failed to save expense");
      }

      await loadData();
      setIsExpenseFormOpen(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to save expense",
      );
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Fuel & Expense Management
          </h2>
          <p className="text-slate-400">Track fuel and other expenses</p>
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
          <div className="flex gap-2">
            <Button
              className="bg-linear-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white flex items-center gap-2"
              onClick={handleAddFuel}
            >
              <Plus size={18} />
              Log Fuel
            </Button>
            <Button
              className="bg-linear-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white flex items-center gap-2"
              onClick={handleAddExpense}
            >
              <Plus size={18} />
              Add Expense
            </Button>
          </div>
        </div>
      </header>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {isFuelFormOpen && (
        <Card className="mb-8 bg-slate-800/50 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">
              {editingFuel ? "Edit Fuel Log" : "Log Fuel"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleFuelSubmit}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Vehicle</label>
                <select
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white"
                  value={fuelFormData.vehicleId}
                  onChange={(event) =>
                    setFuelFormData({
                      ...fuelFormData,
                      vehicleId: event.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select vehicle</option>
                  {fleetOptions.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Date</label>
                <input
                  type="date"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white"
                  value={fuelFormData.date}
                  onChange={(event) =>
                    setFuelFormData({
                      ...fuelFormData,
                      date: event.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Liters</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white"
                  value={fuelFormData.liters}
                  onChange={(event) =>
                    setFuelFormData({
                      ...fuelFormData,
                      liters: event.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Fuel Cost</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white"
                  value={fuelFormData.cost}
                  onChange={(event) =>
                    setFuelFormData({
                      ...fuelFormData,
                      cost: event.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="flex items-end gap-2 md:col-span-2 lg:col-span-4">
                <Button
                  type="submit"
                  disabled={isBusy}
                  className="bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {editingFuel ? "Update" : "Add"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="border border-slate-700"
                  onClick={() => setIsFuelFormOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isExpenseFormOpen && (
        <Card className="mb-8 bg-slate-800/50 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">
              {editingExpense ? "Edit Expense" : "Other Expenses"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleExpenseSubmit}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Trip</label>
                <select
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white"
                  value={expenseFormData.tripId}
                  onChange={(event) =>
                    setExpenseFormData({
                      ...expenseFormData,
                      tripId: event.target.value,
                    })
                  }
                >
                  <option value="">Select trip</option>
                  {tripOptions.map((trip) => (
                    <option key={trip.id} value={trip.id}>
                      {trip.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Vehicle</label>
                <select
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white"
                  value={expenseFormData.vehicleId}
                  onChange={(event) =>
                    setExpenseFormData({
                      ...expenseFormData,
                      vehicleId: event.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select vehicle</option>
                  {fleetOptions.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Type</label>
                <select
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white"
                  value={expenseFormData.type}
                  onChange={(event) =>
                    setExpenseFormData({
                      ...expenseFormData,
                      type: event.target.value,
                    })
                  }
                  required
                >
                  <option value="Toll">Toll</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Other">Other / Misc</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Total</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white"
                  value={expenseFormData.amount}
                  onChange={(event) =>
                    setExpenseFormData({
                      ...expenseFormData,
                      amount: event.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2 lg:col-span-2">
                <label className="text-sm text-slate-300">
                  Description / Note
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white"
                  value={expenseFormData.description}
                  onChange={(event) =>
                    setExpenseFormData({
                      ...expenseFormData,
                      description: event.target.value,
                    })
                  }
                  placeholder="Trip note or maintenance link"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Date</label>
                <input
                  type="date"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white"
                  value={expenseFormData.date}
                  onChange={(event) =>
                    setExpenseFormData({
                      ...expenseFormData,
                      date: event.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="flex items-end gap-2 md:col-span-2 lg:col-span-4">
                <Button
                  type="submit"
                  disabled={isBusy}
                  className="bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {editingExpense ? "Update" : "Add"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="border border-slate-700"
                  onClick={() => setIsExpenseFormOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">FUEL LOGS</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left py-3 px-4">VEHICLE</th>
                  <th className="text-left py-3 px-4">DATE</th>
                  <th className="text-left py-3 px-4">LITERS</th>
                  <th className="text-left py-3 px-4">COST</th>
                  <th className="text-left py-3 px-4">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {fuelLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-slate-700/50 hover:bg-slate-700/30"
                  >
                    <td className="py-3 px-4 text-slate-200">{log.vehicle}</td>
                    <td className="py-3 px-4 text-slate-200">{log.date}</td>
                    <td className="py-3 px-4 text-slate-200">{log.liters}</td>
                    <td className="py-3 px-4 text-slate-200">₹{log.cost}</td>
                    <td className="py-3 px-4 flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-400 hover:text-blue-300"
                        onClick={() => handleEditFuel(log)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleDeleteFuel(log.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">OTHER EXPENSES</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left py-3 px-4">TYPE</th>
                  <th className="text-left py-3 px-4">TRIP</th>
                  <th className="text-left py-3 px-4">VEHICLE</th>
                  <th className="text-left py-3 px-4">TOTAL</th>
                  <th className="text-left py-3 px-4">DATE</th>
                  <th className="text-left py-3 px-4">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {otherExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-b border-slate-700/50 hover:bg-slate-700/30"
                  >
                    <td className="py-3 px-4 text-slate-200">{expense.type}</td>
                    <td className="py-3 px-4 text-slate-200">
                      {expense.tripLabel || expense.description || "—"}
                    </td>
                    <td className="py-3 px-4 text-slate-200">
                      {expense.vehicle}
                    </td>
                    <td className="py-3 px-4 text-slate-200">
                      ₹{expense.amount}
                    </td>
                    <td className="py-3 px-4 text-slate-200">{expense.date}</td>
                    <td className="py-3 px-4 flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-400 hover:text-blue-300"
                        onClick={() => handleEditExpense(expense)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleDeleteExpense(expense.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 bg-slate-800/50 border-purple-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-white">TOTAL OPERATIONAL COST</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-700/50">
              <div className="text-sm text-slate-400 mb-1">FUEL</div>
              <div className="text-2xl font-bold text-white">
                ₹{fuelCostTotal.toLocaleString()}
              </div>
            </div>
            <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-700/50">
              <div className="text-sm text-slate-400 mb-1">TOLL / MISC</div>
              <div className="text-2xl font-bold text-white">
                ₹{(tollTotal + miscTotal).toLocaleString()}
              </div>
            </div>
            <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-700/50">
              <div className="text-sm text-slate-400 mb-1">MAINTENANCE</div>
              <div className="text-2xl font-bold text-white">
                ₹{maintenanceTotal.toLocaleString()}
              </div>
            </div>
            <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-700/50">
              <div className="text-sm text-slate-400 mb-1">TOTAL</div>
              <div className="text-2xl font-bold text-yellow-400">
                ₹{totalOperationalCost.toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
