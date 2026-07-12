import { Pool } from "pg"

declare global {
  // eslint-disable-next-line no-var
  var fleetDbPool: Pool | undefined
}

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL is not set")
}

export const pool = global.fleetDbPool ?? new Pool({ connectionString })

if (process.env.NODE_ENV !== "production") {
  global.fleetDbPool = pool
}

export type FleetRow = {
  id: number
  reg_no: string
  name_model: string
  type: string
  capacity: string
  odometer: number
  acquisition_cost: string
  status: string
}

export const fleetTableSql = `
  CREATE TABLE IF NOT EXISTS fleet_vehicles (
    id SERIAL PRIMARY KEY,
    reg_no TEXT NOT NULL UNIQUE,
    name_model TEXT NOT NULL,
    type TEXT NOT NULL,
    capacity TEXT NOT NULL,
    odometer NUMERIC(12,0) NOT NULL DEFAULT 0,
    acquisition_cost NUMERIC(14,2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`

export const ensureFleetTable = async () => {
  await pool.query(fleetTableSql)
}

export const mapFleetRow = (row: FleetRow) => ({
  id: row.id,
  regNo: row.reg_no,
  nameModel: row.name_model,
  type: row.type,
  capacity: row.capacity,
  odometer: String(row.odometer),
  acquisitionCost: String(row.acquisition_cost),
  status: row.status,
})