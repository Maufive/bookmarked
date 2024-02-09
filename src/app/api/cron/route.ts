import { db } from "@/lib/db";

export async function GET() {
  const users = db.user.findMany();
  return Response.json({ users });
}
