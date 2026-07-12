import { NextResponse } from "next/server"
import { ensureDriverTable, pool } from "../db"

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function DELETE(_: Request, context: RouteContext) {
  try {
    await ensureDriverTable()
    const { id } = await context.params
    const driverId = Number(id)

    if (Number.isNaN(driverId)) {
      return NextResponse.json({ error: "Invalid driver id" }, { status: 400 })
    }

    const result = await pool.query("DELETE FROM drivers WHERE id = $1 RETURNING id", [driverId])

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete driver" },
      { status: 500 },
    )
  }
}