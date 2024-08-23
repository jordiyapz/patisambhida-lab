import db from "@/db";
import { paliSheets, users, type InsertSheet } from "@/db/schema";
import type { SheetWithAuthor } from "@/modules/pali-translation/lib/dto";
import type { APIRoute } from "astro";
import dayjs from "dayjs";
import { eq } from "drizzle-orm";

export const GET: APIRoute = async () => {
  const result = await db
    .select()
    .from(paliSheets)
    .leftJoin(users, eq(users.id, paliSheets.author));

  // SORT by updated date (newest first)
  result.sort((a, b) => {
    const p = dayjs(a["pali-sheets"].updatedAt);
    const q = b["pali-sheets"].updatedAt;
    if (p.isBefore(q)) return 1;
    if (p.isAfter(q)) return -1;
    return 0;
  });

  return new Response(
    JSON.stringify(
      result.map(
        (row) =>
          ({
            ...row["pali-sheets"],
            author: row.users,
          } satisfies SheetWithAuthor)
      )
    )
  );
};

export const POST: APIRoute = async ({ request }) => {
  try {
    let body: Partial<InsertSheet> = {};
    if (request.headers.get("Content-Type") === "application/json") {
      const data = await request.json();
      Object.assign(body, data);
    }
    if (
      request.headers.get("Content-Type") ===
      "application/x-www-form-urlencoded"
    ) {
      const formData = await request.formData();
      const title = formData.get("title")?.toString();
      const transcript = formData.get("transcript")?.toString() ?? "";
      const val = formData.get("json")?.toString();
      Object.assign(body, {
        val,
        transcript,
        title: title === "" ? undefined : title,
      });
    }

    // create author if not exist
    let author = await db.query.users.findFirst({
      where: (field, { eq }) => eq(field.username, "anonymous"),
    });
    if (!author) {
      const newAuthor = await db
        .insert(users)
        .values({ username: "anonymous" })
        .returning();
      author = newAuthor[0];
    }

    const results = await db
      .insert(paliSheets)
      .values({
        ...body,
        author: author.id,
      })
      .returning();

    const responseData: SheetWithAuthor = {
      ...results[0],
      author,
    };

    return new Response(JSON.stringify(responseData));
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
};
