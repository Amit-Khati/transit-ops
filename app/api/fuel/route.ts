import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type FuelPayload = {
  vehicleId?: string;
  date?: string;
  liters?: number;
  cost?: number;
};

export async function GET() {
  try {
    const fuelLogs = await prisma.fuelLog.findMany({
      orderBy: { date: "desc" },
      include: { vehicle: true },
    });

    return NextResponse.json(
      fuelLogs.map((log) => ({
        id: log.id,
        vehicleId: log.vehicleId,
        vehicle: log.vehicle.name,
        date: log.date.toISOString().slice(0, 10),
        liters: `${log.liters} L`,
        cost: `${log.cost}`,
      })),
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load fuel logs" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FuelPayload;

    if (!body.vehicleId || !body.date || typeof body.liters !== "number" || typeof body.cost !== "number") {
      return NextResponse.json({ error: "Vehicle, date, liters, and cost are required" }, { status: 400 });
    }

    const fuelLog = await prisma.fuelLog.create({
      data: {
        vehicleId: body.vehicleId,
        date: new Date(body.date),
        liters: body.liters,
        cost: body.cost,
      },
      include: { vehicle: true },
    });

    return NextResponse.json({
      id: fuelLog.id,
      vehicleId: fuelLog.vehicleId,
      vehicle: fuelLog.vehicle.name,
      date: fuelLog.date.toISOString().slice(0, 10),
      liters: `${fuelLog.liters} L`,
      cost: `${fuelLog.cost}`,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to add fuel log" },
      { status: 500 },
    );
  }
}
