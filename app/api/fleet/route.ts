import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type FleetPayload = {
  regNo?: string;
  nameModel?: string;
  type?: string;
  capacity?: string;
  odometer?: number;
  acquisitionCost?: string;
  status?: string;
};

// Helper to map frontend type to Prisma VehicleType
const mapToVehicleType = (type: string) => {
  const typeMap: Record<string, string> = {
    Van: "VAN",
    Car: "VAN", // Prisma doesn't have Car, map to VAN
    Truck: "TRUCK",
    Mini: "VAN", // Prisma doesn't have Mini, map to VAN
    Pickup: "PICKUP",
    Bus: "BUS",
  };
  return typeMap[type] || "VAN";
};

// Helper to map frontend status to Prisma VehicleStatus
const mapToVehicleStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    Available: "AVAILABLE",
    "On Trip": "ON_TRIP",
    "In Shop": "IN_SHOP",
    Retired: "RETIRED",
  };
  return statusMap[status] || "AVAILABLE";
};

// Helper to map Prisma Vehicle to frontend format
const mapVehicleToFrontend = (vehicle: any) => {
  const typeMap: Record<string, string> = {
    VAN: "Van",
    TRUCK: "Truck",
    PICKUP: "Pickup",
    TRAILER: "Trailer",
    BUS: "Bus",
  };
  const statusMap: Record<string, string> = {
    AVAILABLE: "Available",
    ON_TRIP: "On Trip",
    IN_SHOP: "In Shop",
    RETIRED: "Retired",
  };
  return {
    id: vehicle.id,
    regNo: vehicle.registrationNo,
    nameModel: [vehicle.name, vehicle.model].filter(Boolean).join(" / "),
    type: typeMap[vehicle.type] || vehicle.type,
    capacity: vehicle.maxLoadCapacity.toString(),
    odometer: vehicle.odometer.toString(),
    acquisitionCost: vehicle.acquisitionCost.toString(),
    status: statusMap[vehicle.status] || vehicle.status,
  };
};

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(vehicles.map(mapVehicleToFrontend));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load vehicles" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FleetPayload;

    if (
      !body.regNo ||
      !body.nameModel ||
      !body.type ||
      !body.capacity ||
      typeof body.odometer !== "number" ||
      !body.acquisitionCost ||
      !body.status
    ) {
      return NextResponse.json({ error: "All vehicle fields are required" }, { status: 400 });
    }

    // Split nameModel into name and model (split on first occurrence of " / ")
    const [name, ...modelParts] = body.nameModel.split(" / ");
    const model = modelParts.join(" / ") || null;

    const vehicle = await prisma.vehicle.create({
      data: {
        registrationNo: body.regNo,
        name: name,
        model: model,
        type: mapToVehicleType(body.type) as any,
        maxLoadCapacity: parseFloat(body.capacity) || 0,
        odometer: body.odometer,
        acquisitionCost: parseFloat(body.acquisitionCost) || 0,
        status: mapToVehicleStatus(body.status) as any,
      },
    });

    return NextResponse.json(mapVehicleToFrontend(vehicle), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to add vehicle" },
      { status: 500 },
    );
  }
}
