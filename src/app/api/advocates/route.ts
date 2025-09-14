import { getDb } from "../../../db";
import { advocates } from "../../../db/schema";
import { asc, desc, ilike, or, sql } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const sort = (searchParams.get("sort") || "lastName") as
      | "firstName"
      | "lastName"
      | "city"
      | "degree"
      | "yearsOfExperience";
    const dir = (searchParams.get("dir") || "asc") as "asc" | "desc";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const size = Math.max(1, parseInt(searchParams.get("size") || "10", 10));

    const db = getDb();

    const where = q
      ? or(
          ilike(advocates.firstName, `%${q}%`),
          ilike(advocates.lastName, `%${q}%`),
          ilike(advocates.city, `%${q}%`),
          ilike(advocates.degree, `%${q}%`),
          // cast jsonb specialties to text for a simple contains match
          sql`(${advocates.specialties})::text ILIKE ${"%" + q + "%"}`,
          sql`(${advocates.yearsOfExperience})::text ILIKE ${"%" + q + "%"}`
        )
      : undefined;

    const orderExpr = (() => {
      const dirFn = dir === "asc" ? asc : desc;
      switch (sort) {
        case "firstName":
          return dirFn(advocates.firstName);
        case "lastName":
          return dirFn(advocates.lastName);
        case "city":
          return dirFn(advocates.city);
        case "degree":
          return dirFn(advocates.degree);
        case "yearsOfExperience":
          return dirFn(advocates.yearsOfExperience);
      }
    })();

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(advocates)
      .where(where as any);

    const data = await db
      .select()
      .from(advocates)
      .where(where as any)
      .orderBy(orderExpr as any)
      .limit(size)
      .offset((page - 1) * size);

    return Response.json({ data, page, size, total: Number(count) });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      const { advocateData } = await import("../../../db/seed/advocates");
      return Response.json({ data: advocateData, page: 1, size: advocateData.length, total: advocateData.length });
    }
    return new Response("Database not available", { status: 500 });
  }
}
