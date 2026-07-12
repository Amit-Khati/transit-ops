import { NextResponse } from "next/server"
import { ensureFleetTable, mapFleetRow, pool } from "./db"

type FleetPayload = {
  regNo?: string
  nameModel?: string
  type?: string
  capacity?: string
  odometer?: number
  acquisitionCost?: string
  status?: string
}

export async function GET() {
  try {
    await ensureFleetTable()
    const result = await pool.query(
      `
        SELECT id, reg_no, name_model, type, capacity, odometer, acquisition_cost, status
        FROM fleet_vehicles
        ORDER BY id DESC
      `,
    )

    return NextResponse.json(result.rows.map(mapFleetRow))
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load vehicles" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    await ensureFleetTable()
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
        INSERT INTO fleet_vehicles (reg_no, name_model, type, capacity, odometer, acquisition_cost, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, reg_no, name_model, type, capacity, odometer, acquisition_cost, status
      `,
      [body.regNo, body.nameModel, body.type, body.capacity, body.odometer, body.acquisitionCost, body.status],
    )

    return NextResponse.json(mapFleetRow(result.rows[0]), { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to add vehicle" },
      { status: 500 },
    )
  }
}