import { NextResponse } from "next/server"
import { ensureFleetTable, mapFleetRow, pool } from "../db"

type RouteContext = {
  params: Promise<{ id: string }>
}

type FleetPayload = {
  regNo?: string
  nameModel?: string
  type?: string
  capacity?: string
  odometer?: number
  acquisitionCost?: string
  status?: string
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    await ensureFleetTable()
    const { id } = await context.params
    const vehicleId = Number(id)

    if (Number.isNaN(vehicleId)) {
      return NextResponse.json({ error: "Invalid vehicle id" }, { status: 400 })
    }

    const body = (await request.json()) as FleetPayload

    if (
      !body.regNo ||
      !body.nameModel ||
      !body.type ||
      !body.capacity ||
      typeof body.odometer !== "number" ||
      !body.acquisitionCost ||
      !body.status
    ) {
      return NextResponse.json({ error: "All vehicle fields are required" }, { status: 400 })
    }

    const result = await pool.query(
      `
        UPDATE fleet_vehicles
        SET reg_no = $1, name_model = $2, type = $3, capacity = $4, odometer = $5, acquisition_cost = $6, status = $7, updated_at = NOW()
        WHERE id = $8
        RETURNING id, reg_no, name_model, type, capacity, odometer, acquisition_cost, status
      `,
      [body.regNo, body.nameModel, body.type, body.capacity, body.odometer, body.acquisitionCost, body.status, vehicleId],
    )

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    return NextResponse.json(mapFleetRow(result.rows[0]))
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update vehicle" },
      { status: 500 },
    )
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  try {
    await ensureFleetTable()
    const { id } = await context.params
    const vehicleId = Number(id)

    if (Number.isNaN(vehicleId)) {
      return NextResponse.json({ error: "Invalid vehicle id" }, { status: 400 })
    }

    const result = await pool.query("DELETE FROM fleet_vehicles WHERE id = $1 RETURNING id", [vehicleId])

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete vehicle" },
      { status: 500 },
    )
  }
}