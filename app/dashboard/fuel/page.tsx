
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Search, Plus, Edit, Trash2 } from "lucide-react";

type FuelLog = {
  id: number
  vehicle: string
  date: string
  liters: string
  cost: string
};

type Expense = {
  id: number
  type: string
  vehicle: string
  cost: string
  date: string
  slipNo: string
};

export default function FuelPage() {
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([
    { id: 1, vehicle: "VAN-001", date: "08 Jul 2024", liters: "45 L", cost: "4,500" },
    { id: 2, vehicle: "TRUCK-01", date: "06 Jul 2024", liters: "110 L", cost: "9,900" },
    { id: 3, vehicle: "PICK-02", date: "04 Jul 2024", liters: "35 L", cost: "3,150" },
  ]);

  const [otherExpenses, setOtherExpenses] = useState<Expense[]>([
    { id: 1, type: "Toll", vehicle: "VAN-001", cost: "450", date: "08 Jul 2024", slipNo: "KA-T-2024-07-08" },
    { id: 2, type: "Food", vehicle: "TRUCK-01", cost: "380", date: "06 Jul 2024", slipNo: "TRUCK-01-FOOD-07-06" },
  ]);

  const [isFuelFormOpen, setIsFuelFormOpen] = useState(false);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  const [editingFuel, setEditingFuel] = useState<FuelLog | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [fuelFormData, setFuelFormData] = useState<Omit<FuelLog, "id">>({ vehicle: "", date: "", liters: "", cost: "" });
  const [expenseFormData, setExpenseFormData] = useState<Omit<Expense, "id">>({ type: "", vehicle: "", cost: "", date: "", slipNo: "" });

  const handleAddFuel = () => {
    setEditingFuel(null);
    setFuelFormData({ vehicle: "", date: "", liters: "", cost: "" });
    setIsFuelFormOpen(true);
  };

  const handleEditFuel = (log: FuelLog) => {
    setEditingFuel(log);
    setFuelFormData(log);
    setIsFuelFormOpen(true);
  };

  const handleDeleteFuel = (id: number) => {
    setFuelLogs(fuelLogs.filter(log => log.id !== id));
  };

  const handleFuelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFuel) {
      setFuelLogs(fuelLogs.map(log => log.id === editingFuel.id ? { ...fuelFormData, id: editingFuel.id } : log));
    } else {
      setFuelLogs([...fuelLogs, { ...fuelFormData, id: Date.now() }]);
    }
    setIsFuelFormOpen(false);
  };

  const handleAddExpense = () => {
    setEditingExpense(null);
    setExpenseFormData({ type: "", vehicle: "", cost: "", date: "", slipNo: "" });
    setIsExpenseFormOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setExpenseFormData(expense);
    setIsExpenseFormOpen(true);
  };

  const handleDeleteExpense = (id: number) => {
    setOtherExpenses(otherExpenses.filter(expense => expense.id !== id));
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExpense) {
      setOtherExpenses(otherExpenses.map(expense => expense.id === editingExpense.id ? { ...expenseFormData, id: editingExpense.id } : expense));
    } else {
      setOtherExpenses([...otherExpenses, { ...expenseFormData, id: Date.now() }]);
    }
    setIsExpenseFormOpen(false);
  };

  return (
    <>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Fuel & Expense Management</h2>
          <p className="text-slate-400">Track fuel and other expenses</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <Button variant="ghost" className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50">
            <Bell size={20} />
          </Button>
          <div className="flex gap-2">
            <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white flex items-center gap-2" onClick={handleAddFuel}>
              <Plus size={18} />
              Log Fuel
            </Button>
            <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white flex items-center gap-2" onClick={handleAddExpense}>
              <Plus size={18} />
              Add Expense
            </Button>
          </div>
        </div>
      </header>

      {isFuelFormOpen && (
        <Card className="mb-8 bg-slate-800/50 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">{editingFuel ? "Edit Fuel Log" : "Log Fuel"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFuelSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Vehicle</label>
                <input
                  type="text"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white"
                  value={fuelFormData.vehicle}
                  onChange={(e) => setFuelFormData({ ...fuelFormData, vehicle: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Date</label>
                <input
                  type="text"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white"
                  value={fuelFormData.date}
                  onChange={(e) => setFuelFormData({ ...fuelFormData, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Liters</label>
                <input
                  type="text"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white"
                  value={fuelFormData.liters}
                  onChange={(e) => setFuelFormData({ ...fuelFormData, liters: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Cost</label>
                <input
                  type="text"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white"
                  value={fuelFormData.cost}
                  onChange={(e) => setFuelFormData({ ...fuelFormData, cost: e.target.value })}
                  required
                />
              </div>
              <div className="flex items-end gap-2">
                <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  {editingFuel ? "Update" : "Add"}
                </Button>
                <Button type="button" variant="ghost" className="border border-slate-700" onClick={() => setIsFuelFormOpen(false)}>
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
            <CardTitle className="text-white">{editingExpense ? "Edit Expense" : "Add Expense"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleExpenseSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Type</label>
                <input
                  type="text"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white"
                  value={expenseFormData.type}
                  onChange={(e) => setExpenseFormData({ ...expenseFormData, type: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Vehicle</label>
                <input
                  type="text"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white"
                  value={expenseFormData.vehicle}
                  onChange={(e) => setExpenseFormData({ ...expenseFormData, vehicle: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Cost</label>
                <input
                  type="text"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white"
                  value={expenseFormData.cost}
                  onChange={(e) => setExpenseFormData({ ...expenseFormData, cost: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Date</label>
                <input
                  type="text"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white"
                  value={expenseFormData.date}
                  onChange={(e) => setExpenseFormData({ ...expenseFormData, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Slip No.</label>
                <input
                  type="text"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white"
                  value={expenseFormData.slipNo}
                  onChange={(e) => setExpenseFormData({ ...expenseFormData, slipNo: e.target.value })}
                  required
                />
              </div>
              <div className="flex items-end gap-2">
                <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  {editingExpense ? "Update" : "Add"}
                </Button>
                <Button type="button" variant="ghost" className="border border-slate-700" onClick={() => setIsExpenseFormOpen(false)}>
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
                  <tr key={log.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="py-3 px-4 text-slate-200">{log.vehicle}</td>
                    <td className="py-3 px-4 text-slate-200">{log.date}</td>
                    <td className="py-3 px-4 text-slate-200">{log.liters}</td>
                    <td className="py-3 px-4 text-slate-200">₹{log.cost}</td>
                    <td className="py-3 px-4 flex gap-2">
                      <Button variant="ghost" size="icon" className="text-blue-400 hover:text-blue-300" onClick={() => handleEditFuel(log)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300" onClick={() => handleDeleteFuel(log.id)}>
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
            <CardTitle className="text-white">OTHER EXPENSES (TOLL / MEAL)</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left py-3 px-4">TYPE</th>
                  <th className="text-left py-3 px-4">VEHICLE</th>
                  <th className="text-left py-3 px-4">COST</th>
                  <th className="text-left py-3 px-4">SLIP NO.</th>
                  <th className="text-left py-3 px-4">DATE</th>
                  <th className="text-left py-3 px-4">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {otherExpenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="py-3 px-4 text-slate-200">{expense.type}</td>
                    <td className="py-3 px-4 text-slate-200">{expense.vehicle}</td>
                    <td className="py-3 px-4 text-slate-200">₹{expense.cost}</td>
                    <td className="py-3 px-4 text-slate-200">{expense.slipNo}</td>
                    <td className="py-3 px-4 text-slate-200">{expense.date}</td>
                    <td className="py-3 px-4 flex gap-2">
                      <Button variant="ghost" size="icon" className="text-blue-400 hover:text-blue-300" onClick={() => handleEditExpense(expense)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300" onClick={() => handleDeleteExpense(expense.id)}>
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
          <CardTitle className="text-white">TOTAL OPERATIONAL COST (FUEL + MAINTENANCE + MEAL)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-700/50">
              <div className="text-sm text-slate-400 mb-1">FUEL</div>
              <div className="text-2xl font-bold text-white">₹17,550</div>
            </div>
            <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-700/50">
              <div className="text-sm text-slate-400 mb-1">TOLL / MEAL</div>
              <div className="text-2xl font-bold text-white">₹830</div>
            </div>
            <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-700/50">
              <div className="text-sm text-slate-400 mb-1">MAINTENANCE</div>
              <div className="text-2xl font-bold text-white">₹27,500</div>
            </div>
            <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-700/50">
              <div className="text-sm text-slate-400 mb-1">TOTAL</div>
              <div className="text-2xl font-bold text-yellow-400">₹45,880</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
