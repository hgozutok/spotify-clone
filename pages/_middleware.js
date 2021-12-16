import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

NextResponse;

export async function middleware(req, res, next) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  const { pathname } = req.nextUrl;

  if (pathname.includes("api/auth") || token) {
    return NextResponse.next();
  }

  if (!token && !pathname.includes("login")) {
    return NextResponse.redirect("/login");
  }
}
