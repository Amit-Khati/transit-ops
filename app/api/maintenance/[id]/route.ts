import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const maintenance = await prisma.maintenance.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        cost: body.cost ? Number(body.cost) : undefined,
        status: body.status,
        closedAt: body.status === "CLOSED" ? new Date() : null,
      },
      include: { vehicle: true },
    });

    // If maintenance is now CLOSED, set vehicle back to AVAILABLE
    if (maintenance.status === "CLOSED") {
      await prisma.vehicle.update({
        where: { id: maintenance.vehicleId },
        data: { status: "AVAILABLE" },
      });
    }

    return NextResponse.json(maintenance);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update maintenance" },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const maintenance = await prisma.maintenance.findUnique({ where: { id } });

    if (!maintenance) {
      return NextResponse.json({ error: "Maintenance not found" }, { status: 404 });
    }

    await prisma.maintenance.delete({ where: { id } });

    // If maintenance was OPEN, set vehicle back to AVAILABLE
    if (maintenance.status === "OPEN") {
      await prisma.vehicle.update({
        where: { id: maintenance.vehicleId },
        data: { status: "AVAILABLE" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete maintenance" },
      { status: 500 }
    );
  }
}
