import db from "@/db";
import { cities } from "@/db/schema";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const cities = await db.query.cities.findMany();
  return new Response(JSON.stringify(cities));
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name } = body;
    const newCity = await db.insert(cities).values({ name }).run();
    return new Response(JSON.stringify(newCity));
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
};

export const DELETE: APIRoute = async () => {
  const res = await db.delete(cities);
  return new Response(JSON.stringify(res));
};
