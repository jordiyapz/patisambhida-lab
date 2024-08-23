import {
  sqliteTable,
  foreignKey,
  integer,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const cities = sqliteTable("cities", {
  id: integer("id").primaryKey().notNull(),
  name: text("name"),
  countryId: integer("country_id").references(() => countries.id),
});

export const countries = sqliteTable(
  "countries",
  {
    id: integer("id").primaryKey().notNull(),
    name: text("name"),
  },
  (table) => {
    return {
      nameIdx: uniqueIndex("nameIdx").on(table.name),
    };
  }
);

export const paliSheets = sqliteTable("pali-sheets", {
  id: integer("id").primaryKey().notNull(),
  title: text("title"),
  transcript: text("transcript"),
  val: text("val"),
});
