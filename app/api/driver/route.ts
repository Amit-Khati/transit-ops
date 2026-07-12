import { NextResponse } from "next/server"
import { ensureDriverTable, mapDriverRow, pool } from "./db"

type DriverPayload = {
  name?: string
  username?: string
  age?: number
  gender?: string
  email?: string
  phoneNo?: string
  address?: string
  drivingLicense?: string
}

export async function GET() {
  try {
    await ensureDriverTable()
    const result = await pool.query(
      `
        SELECT id, name, username, age, gender, email, phone_no, address, driving_license
        FROM drivers
        ORDER BY id DESC
      `,
    )

    return NextResponse.json(result.rows.map(mapDriverRow))
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load drivers" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    await ensureDriverTable()
    const body = (await request.json()) as DriverPayload

    if (
      !body.name ||
      !body.username ||
      typeof body.age !== "number" ||
      !body.gender ||
      !body.email ||
      !body.phoneNo ||
      !body.address ||
      !body.drivingLicense
    ) {
      return NextResponse.json({ error: "All driver fields are required" }, { status: 400 })
    }

    const result = await pool.query(
      `
        INSERT INTO drivers (name, username, age, gender, email, phone_no, address, driving_license)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, name, username, age, gender, email, phone_no, address, driving_license
      `,
      [
        body.name,
        body.username,
        body.age,
        body.gender,
        body.email,
        body.phoneNo,
        body.address,
        body.drivingLicense,
      ],
    )

    return NextResponse.json(mapDriverRow(result.rows[0]), { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add driver"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}