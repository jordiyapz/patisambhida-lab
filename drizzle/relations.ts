import { relations } from "drizzle-orm/relations";
import { countries, cities } from "./schema";

export const citiesRelations = relations(cities, ({one}) => ({
	country: one(countries, {
		fields: [cities.countryId],
		references: [countries.id]
	}),
}));

export const countriesRelations = relations(countries, ({many}) => ({
	cities: many(cities),
}));