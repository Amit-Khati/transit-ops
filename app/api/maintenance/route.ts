import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const maintenance = await prisma.maintenance.findMany({
      include: { vehicle: true },
      orderBy: { openedAt: "desc" },
    });
    return NextResponse.json(maintenance);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load maintenance" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.vehicleId || !body.title || !body.cost) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    const maintenance = await prisma.maintenance.create({
      data: {
        vehicleId: body.vehicleId,
        title: body.title,
        description: body.description,
        cost: Number(body.cost),
        status: body.status || "OPEN",
      },
      include: { vehicle: true },
    });

    // If maintenance status is OPEN, set vehicle status to IN_SHOP
    if (maintenance.status === "OPEN") {
      await prisma.vehicle.update({
        where: { id: body.vehicleId },
        data: { status: "IN_SHOP" },
      });
    }

    return NextResponse.json(maintenance, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to add maintenance" },
      { status: 500 }
    );
  }
}
