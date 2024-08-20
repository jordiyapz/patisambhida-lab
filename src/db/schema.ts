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
  transcript: text("transcript").default(""),
  val: text("val", { mode: "json" }),
});

export type City = typeof cities.$inferSelect; // return type when queried
export type InsertCity = typeof cities.$inferInsert; // insert type
export type Sheet = typeof paliSheets.$inferSelect; // insert type
export type InsertSheet = typeof paliSheets.$inferInsert; // insert type
