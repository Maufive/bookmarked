import NextResponse from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const users = await db.user.findMany();
  console.log("Queried users", users.length);
  return NextResponse.NextResponse.json({ users });
}
