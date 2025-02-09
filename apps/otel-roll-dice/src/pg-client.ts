import { drizzle } from 'drizzle-orm/node-postgres';
import { DrizzleSchema } from "@repo/postgres-database";
import { metrics } from '@opentelemetry/api';
const db = drizzle("postgres://postgres:postgres@localhost:5432/chess?sslmode=disable");

const meter = metrics.getMeter('db-client');

const histogram = meter.createHistogram("db-client.get-games.duration",{
  unit: "milliseconds",
  description: "Duration of the getGames function",
})

const gauge = meter.createGauge("db-client.get-games.duration.gauge", {
  description: "Duration of the getGames function",
  unit: "milliseconds",
});

export async function getGames() {
  const start = new Date().getTime();
  const delay = Math.random() * 1000;
  await new Promise((resolve) => setTimeout(resolve, delay));
  const result = db.select().from(DrizzleSchema.games);
  histogram.record(new Date().getTime() - start);
  gauge.record(new Date().getTime() - start);
  return result;
}
