import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type FuelPayload = {
  vehicleId?: string;
  date?: string;
  liters?: number;
  cost?: number;
};

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = (await request.json()) as FuelPayload;
    const fuelLog = await prisma.fuelLog.update({
      where: { id: params.id },
      data: {
        vehicleId: body.vehicleId,
        date: body.date ? new Date(body.date) : undefined,
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
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update fuel log" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.fuelLog.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete fuel log" },
      { status: 500 },
    );
  }
}
