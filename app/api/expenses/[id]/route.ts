import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type ExpensePayload = {
  tripId?: string;
  vehicleId?: string;
  type?: string;
  amount?: number;
  description?: string;
  date?: string;
};

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = (await request.json()) as ExpensePayload;
    const expense = await prisma.expense.update({
      where: { id: params.id },
      data: {
        vehicleId: body.vehicleId,
        type: body.type as any,
        amount: body.amount,
        description: body.description,
        date: body.date ? new Date(body.date) : undefined,
      },
      include: { vehicle: true },
    });

    return NextResponse.json({
      id: expense.id,
      tripId: expense.id,
      vehicleId: expense.vehicleId,
      vehicle: expense.vehicle.name,
      type: expense.type,
      amount: `${expense.amount}`,
      description: expense.description ?? "",
      date: expense.date.toISOString().slice(0, 10),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update expense" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.expense.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete expense" },
      { status: 500 },
    );
  }
}
