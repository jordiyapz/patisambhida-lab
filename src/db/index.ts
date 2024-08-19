import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const client = createClient({
  url: import.meta.env.TURSO_PALI_DB_URL,
  authToken: import.meta.env.TURSO_PALI_DB_TOKEN,
});

const db = drizzle(client, { schema });

export default db;
