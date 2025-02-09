import { drizzle } from 'drizzle-orm/node-postgres';
import { DrizzleSchema } from "@repo/postgres-database";
const db = drizzle("postgres://postgres:postgres@localhost:5432/chess?sslmode=disable");

export function getGames() {
  return db.select().from(DrizzleSchema.games);
}
