
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );

  // JWT auth cookie clearing is disabled while JWT is commented out.
  // response.cookies.set("auth_token", "", {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "lax",
  //   maxAge: 0,
  //   path: "/",
  // });

  return response;
}
