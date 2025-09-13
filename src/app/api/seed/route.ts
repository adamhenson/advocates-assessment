import { getDb } from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function POST() {
  const db = getDb();
  const normalized = advocateData.map((a) => ({
    ...a,
    phoneNumber: String(a.phoneNumber),
  }));
  const records = await db.insert(advocates).values(normalized).returning();

  return Response.json({ advocates: records });
}
