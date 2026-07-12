
import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    // JWT-based user lookup is disabled while working locally.
    return NextResponse.json(
      {
        message: "JWT auth disabled",
        authenticated: false,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/auth/me:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
