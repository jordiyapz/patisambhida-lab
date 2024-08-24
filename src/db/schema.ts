import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

import {
  uniqueNamesGenerator,
  NumberDictionary,
  adjectives,
  names,
} from "unique-names-generator";
import { createId } from "@paralleldrive/cuid2";

export const countries = sqliteTable(
  "countries",
  {
    id: integer("id").primaryKey(),
    name: text("name"),
  },
  (countries) => ({
    nameIdx: uniqueIndex("nameIdx").on(countries.name),
  })
);

export const cities = sqliteTable("cities", {
  id: integer("id").primaryKey(),
  name: text("name"),
  countryId: integer("country_id").references(() => countries.id),
});

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  username: text("username").notNull().unique(),
});

export const paliSheets = sqliteTable("pali-sheets", {
  id: integer("id").primaryKey(),
  title: text("title").$defaultFn(() =>
    uniqueNamesGenerator({
      dictionaries: [
        adjectives,
        names,
        NumberDictionary.generate({ length: 3 }),
      ],
      style: "lowerCase",
    })
  ),
  author: text("author").references(() => users.id, { onDelete: "set null" }),
  transcript: text("transcript").default(""),
  translation: text("translation", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export type City = typeof cities.$inferSelect; // return type when queried
export type InsertCity = typeof cities.$inferInsert;
export type Sheet = typeof paliSheets.$inferSelect;
export type InsertSheet = typeof paliSheets.$inferInsert;
export type User = typeof users.$inferSelect;
