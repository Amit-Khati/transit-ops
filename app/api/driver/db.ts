import { Pool } from "pg"

declare global {
  // eslint-disable-next-line no-var
  var driverDbPool: Pool | undefined
}

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL is not set")
}

export const pool = global.driverDbPool ?? new Pool({ connectionString })

if (process.env.NODE_ENV !== "production") {
  global.driverDbPool = pool
}

export type DriverRow = {
  id: number
  name: string
  username: string
  age: number
  gender: string
  email: string
  phone_no: string
  address: string
  driving_license: string
}

export const driverTableSql = `
  CREATE TABLE IF NOT EXISTS drivers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    age INTEGER NOT NULL CHECK (age >= 18),
    gender TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone_no TEXT NOT NULL,
    address TEXT NOT NULL,
    driving_license TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`

export const ensureDriverTable = async () => {
  await pool.query(driverTableSql)
}

export const mapDriverRow = (row: DriverRow) => ({
  id: row.id,
  name: row.name,
  username: row.username,
  age: row.age,
  gender: row.gender,
  email: row.email,
  phoneNo: row.phone_no,
  address: row.address,
  drivingLicense: row.driving_license,
})