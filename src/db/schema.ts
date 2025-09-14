import { sql } from "drizzle-orm";
import { pgTable, integer, text, jsonb, serial, timestamp, index } from "drizzle-orm/pg-core";

const advocates = pgTable(
  "advocates",
  {
    id: serial("id").primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    city: text("city").notNull(),
    degree: text("degree").notNull(),
    specialties: jsonb("payload").default([]).notNull(),
    yearsOfExperience: integer("years_of_experience").notNull(),
    phoneNumber: text("phone_number").notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    idxFirstName: index("advocates_first_name_idx").on(t.firstName),
    idxLastName: index("advocates_last_name_idx").on(t.lastName),
    idxCity: index("advocates_city_idx").on(t.city),
    idxDegree: index("advocates_degree_idx").on(t.degree),
    idxYears: index("advocates_years_idx").on(t.yearsOfExperience),
  })
);

export { advocates };
