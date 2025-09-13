import { getDb } from "../../../db";
import { advocates } from "../../../db/schema";

export async function GET() {
  try {
    const db = getDb();
    const data = await db.select().from(advocates);
    return Response.json({ data });
  } catch (err) {
    // Fallback to static data only in development when DB is not configured
    if (process.env.NODE_ENV !== "production") {
      const { advocateData } = await import("../../../db/seed/advocates");
      return Response.json({ data: advocateData });
    }
    return new Response("Database not available", { status: 500 });
  }
}
