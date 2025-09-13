import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export const getDb = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  const queryClient = postgres(url);
  const db = drizzle(queryClient);
  return db;
};

export default getDb;
