import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "./schema";
import fs from "fs";
import path from "path";

function getCleanDatabaseUrl(): string {
  let raw = process.env.DATABASE_URL;
  if (!raw) {
    try {
      const envPath = path.resolve(process.cwd(), ".env.local");
      const fallbackPath = path.resolve(process.cwd(), ".env");
      const fileToRead = fs.existsSync(envPath) ? envPath : fallbackPath;
      if (fs.existsSync(fileToRead)) {
        const content = fs.readFileSync(fileToRead, "utf-8");
        const match = content.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
        if (match) raw = match[1];
      }
    } catch {}
  }
  if (!raw) return "";

  try {
    const parsed = new URL(raw);
    if (parsed.hostname.includes("pooler.supabase.com")) {
      parsed.port = "6543";
    }
    return parsed.toString();
  } catch {
    return raw;
  }
}

const client = postgres(getCleanDatabaseUrl(), {
  prepare: false,
  ssl: 'require',
  connect_timeout: 30,
  idle_timeout: 10,
  max_lifetime: 60 * 5,
  max: 10,
});

export const db = drizzle(client, { schema, logger: false });
