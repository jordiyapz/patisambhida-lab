import db from "@/db";
import { paliSheets } from "@/db/schema";
import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";

export const PATCH: APIRoute = async ({ request, params }) => {
  try {
    const id = Number(params["id"]);
    if (request.headers.get("Content-Type") === "application/json") {
      const body = await request.json();
      const responseData = await db
        .update(paliSheets)
        .set(body)
        .where(eq(paliSheets.id, id))
        .returning();
      return new Response(JSON.stringify(responseData[0]));
    }
  } catch (error) {
    return new Response(JSON.stringify(error));
  }
  return new Response(null, { status: 400 });
};
