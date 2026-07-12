import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type DriverPayload = {
  name?: string;
  username?: string;
  age?: number;
  gender?: string;
  email?: string;
  phoneNo?: string;
  address?: string;
  drivingLicense?: string;
};

// Helper to map Prisma Driver to frontend format
const mapDriverToFrontend = (driver: any) => {
  return {
    id: driver.id,
    name: driver.name,
    username: driver.licenseNumber, // Use license number as username since Prisma doesn't have username
    age: 30, // Default age since Prisma doesn't have age
    gender: "Male", // Default gender since Prisma doesn't have gender
    email: "driver@example.com", // Default email since Prisma doesn't have email
    phoneNo: driver.contactNumber,
    address: "Unknown", // Default address since Prisma doesn't have address
    drivingLicense: driver.licenseNumber,
  };
};

export async function GET() {
  try {
    const drivers = await prisma.driver.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(drivers.map(mapDriverToFrontend));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load drivers" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DriverPayload;

    if (
      !body.name ||
      !body.drivingLicense ||
      !body.phoneNo
    ) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    const driver = await prisma.driver.create({
      data: {
        name: body.name,
        licenseNumber: body.drivingLicense,
        licenseCategory: "LMV", // Default license category
        licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Default 1 year from now
        contactNumber: body.phoneNo,
      },
    });

    return NextResponse.json(mapDriverToFrontend(driver), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to add driver" },
      { status: 500 },
    );
  }
}
