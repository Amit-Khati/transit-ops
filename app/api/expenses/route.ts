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

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { date: "desc" },
      include: { vehicle: true },
    });

    return NextResponse.json(
      expenses.map((expense) => ({
        id: expense.id,
        tripId: expense.id,
        vehicleId: expense.vehicleId,
        vehicle: expense.vehicle.name,
        type: expense.type,
        amount: `${expense.amount}`,
        description: expense.description ?? "",
        date: expense.date.toISOString().slice(0, 10),
      })),
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load expenses" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ExpensePayload;

    if (!body.vehicleId || !body.type || typeof body.amount !== "number" || !body.date) {
      return NextResponse.json({ error: "Vehicle, type, amount, and date are required" }, { status: 400 });
    }

    const expense = await prisma.expense.create({
      data: {
        vehicleId: body.vehicleId,
        type: body.type as any,
        amount: body.amount,
        description: body.description,
        date: new Date(body.date),
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
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to add expense" },
      { status: 500 },
    );
  }
}
