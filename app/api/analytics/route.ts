import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type AnalyticsVehicle = {
  id: string;
  name: string | null;
  acquisitionCost: number;
};

type AnalyticsTrip = {
  id: string;
  plannedDistance: number;
  actualDistance: number | null;
  revenue: number | null;
  status: string;
  createdAt: Date;
};

type AnalyticsExpense = {
  vehicleId: string;
  amount: number;
};

type AnalyticsFuelLog = {
  vehicleId: string;
  cost: number;
  liters: number;
};

export async function GET() {
  try {
    const [vehicles, trips, expenses, fuelLogs] = await Promise.all([
      prisma.vehicle.findMany({
        select: {
          id: true,
          name: true,
          odometer: true,
          acquisitionCost: true,
          status: true,
        },
      }),
      prisma.trip.findMany({
        select: {
          id: true,
          cargoWeight: true,
          plannedDistance: true,
          actualDistance: true,
          fuelConsumed: true,
          revenue: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.expense.findMany({
        select: {
          vehicleId: true,
          amount: true,
          type: true,
          date: true,
        },
      }),
      prisma.fuelLog.findMany({
        select: {
          vehicleId: true,
          cost: true,
          liters: true,
          date: true,
        },
      }),
    ]);

    const completedTrips = trips.filter((trip: AnalyticsTrip) => trip.status === "COMPLETED");
    const dispatchedTrips = trips.filter((trip: AnalyticsTrip) => trip.status === "DISPATCHED");

    const totalDistance = completedTrips.reduce((sum: number, trip: AnalyticsTrip) => sum + (trip.actualDistance ?? trip.plannedDistance ?? 0), 0);
    const totalFuel = fuelLogs.reduce((sum: number, log: AnalyticsFuelLog) => sum + (log.liters ?? 0), 0);
    const totalFuelCost = fuelLogs.reduce((sum: number, log: AnalyticsFuelLog) => sum + (log.cost ?? 0), 0);
    const totalOperationalCost = expenses.reduce((sum: number, expense: AnalyticsExpense) => sum + (expense.amount ?? 0), 0) + totalFuelCost;

    const vehicleCostMap = vehicles.reduce((acc: Record<string, number>, vehicle: AnalyticsVehicle) => {
      acc[vehicle.id] = 0;
      return acc;
    }, {} as Record<string, number>);

    expenses.forEach((expense: AnalyticsExpense) => {
      const vehicleId = expense.vehicleId;
      if (vehicleId && vehicleCostMap[vehicleId] !== undefined) {
        vehicleCostMap[vehicleId] += Number(expense.amount ?? 0);
      }
    });

    fuelLogs.forEach((log: AnalyticsFuelLog) => {
      const vehicleId = log.vehicleId;
      if (vehicleId && vehicleCostMap[vehicleId] !== undefined) {
        vehicleCostMap[vehicleId] += Number(log.cost ?? 0);
      }
    });

    const avgFuelEfficiency = totalFuel > 0 && totalDistance > 0 ? totalDistance / totalFuel : 0;
    const fleetUtilization = vehicles.length > 0 ? ((dispatchedTrips.length + completedTrips.length) / vehicles.length) * 100 : 0;
    const operationalCost = totalOperationalCost;
    const vehicleRoi = vehicles.length > 0
      ? ((completedTrips.reduce((sum: number, trip: AnalyticsTrip) => sum + (trip.revenue ?? 0), 0) - totalOperationalCost) / Math.max(1, vehicles.reduce((sum: number, vehicle: AnalyticsVehicle) => sum + Number(vehicle.acquisitionCost ?? 0), 0))) * 100
      : 0;

    const monthlyRevenue = trips.reduce((acc: Record<string, number>, trip: AnalyticsTrip) => {
      const month = trip.createdAt.toISOString().slice(0, 7);
      if (!acc[month]) acc[month] = 0;
      acc[month] += Number(trip.revenue ?? 0);
      return acc;
    }, {} as Record<string, number>);

    const topVehicleCosts = vehicles
      .map((vehicle: AnalyticsVehicle) => ({
        id: vehicle.id,
        name: vehicle.name || vehicle.id,
        cost: Number(vehicleCostMap[vehicle.id] ?? 0) + Number(vehicle.acquisitionCost ?? 0),
      }))
      .sort((left: { cost: number }, right: { cost: number }) => right.cost - left.cost)
      .slice(0, 5);

    return NextResponse.json({
      summary: {
        fuelEfficiency: Number(avgFuelEfficiency.toFixed(2)),
        fleetUtilization: Number(fleetUtilization.toFixed(2)),
        operationalCost: Number(operationalCost.toFixed(2)),
        vehicleRoi: Number(vehicleRoi.toFixed(2)),
      },
      monthlyRevenue,
      topVehicleCosts,
      totals: {
        vehicles: vehicles.length,
        trips: trips.length,
        expenses: expenses.length,
        fuelLogs: fuelLogs.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load analytics" },
      { status: 500 },
    );
  }
}
