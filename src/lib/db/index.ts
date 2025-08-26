import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

if (typeof window !== "undefined") {
  throw new Error("db should never be used in the browser");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

console.log("Loaded DATABASE_URL:", process.env.DATABASE_URL);

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, { schema });
