import { getDb } from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function POST() {
  const db = getDb();
  const records = await db.insert(advocates).values(advocateData).returning();

  return Response.json({ advocates: records });
}
