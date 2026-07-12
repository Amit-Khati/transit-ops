
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type TripPayload = {
  source?: string;
  destination?: string;
  cargoWeight?: number;
  plannedDistance?: number;
  actualDistance?: number;
  fuelConsumed?: number;
  revenue?: number;
  status?: string;
  vehicleId?: string;
  driverId?: string;
};

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = (await request.json()) as TripPayload;
    const { id } = params;

    const trip = await prisma.trip.update({
      where: { id },
      data: {
        source: body.source,
        destination: body.destination,
        cargoWeight: body.cargoWeight,
        plannedDistance: body.plannedDistance,
        actualDistance: body.actualDistance,
        fuelConsumed: body.fuelConsumed,
        revenue: body.revenue,
        status: body.status as any,
        vehicleId: body.vehicleId,
        driverId: body.driverId,
      },
    });

    return NextResponse.json(trip);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update trip" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.trip.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Trip deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete trip" },
      { status: 500 }
    );
  }
}
