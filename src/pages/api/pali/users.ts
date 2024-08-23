import db from "@/db";
import { users } from "@/db/schema";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const sheets = await db.query.users.findMany();
  return new Response(JSON.stringify(sheets));
};

// Create user
// Type: text/json
export const POST: APIRoute = async ({ request }) => {
  try {
    const { username } = await request.json();

    if (!username)
      return new Response("username are required", { status: 400 });

    const result = await db.insert(users).values({ username }).returning();

    return new Response(JSON.stringify(result));
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
};
