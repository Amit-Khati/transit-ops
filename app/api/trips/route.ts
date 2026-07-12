
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

export async function GET() {
  try {
    const trips = await prisma.trip.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(trips);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load trips" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TripPayload;

    if (
      !body.source ||
      !body.destination ||
      typeof body.cargoWeight !== "number" ||
      typeof body.plannedDistance !== "number" ||
      !body.status ||
      !body.vehicleId ||
      !body.driverId
    ) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    const trip = await prisma.trip.create({
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

    return NextResponse.json(trip, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to add trip" },
      { status: 500 }
    );
  }
}
