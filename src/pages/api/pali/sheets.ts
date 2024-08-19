import db from "@/db";
import { cities, paliSheets } from "@/db/schema";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const sheets = await db.query.paliSheets.findMany();
  return new Response(JSON.stringify(sheets));
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const title = formData.get("title")?.toString();
    const transcript = formData.get("transcript")?.toString();
    const val = formData.get("json")?.toString();

    if (!transcript || !val)
      return new Response("transcript and json are required", { status: 400 });

    const result = await db
      .insert(paliSheets)
      .values({ title, transcript, val })
      .returning();

    return new Response(JSON.stringify(result));
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
};

export const DELETE: APIRoute = async () => {
  const res = await db.delete(cities);
  return new Response(JSON.stringify(res));
};
