import NextResponse from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const users = db.user.findMany();
  return NextResponse.NextResponse.json({ users });
}
