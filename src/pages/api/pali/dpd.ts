import db from "@/db";
import { dpdSearches } from "@/db/schema";
import { json } from "@/lib/utils";
import type { DPDResult } from "@/modules/pali-translation/lib/dto";
import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";

const responseConfig = {
  headers: {
    "Cache-Control": "s-max-age=3600, max-age=7200, public",
    ETag: "version:1",
  },
};

export const GET: APIRoute = async ({ url }) => {
  const search = url.searchParams.get("q");
  if (!search) return json();

  const res = await db.query.dpdSearches.findFirst({
    where: eq(dpdSearches.search, search),
  });
  if (res)
    return json(
      { summary_html: res.summaryHtml, dpd_html: res.dpdHtml },
      responseConfig
    );

  const response = await fetch(
    `https://www.dpdict.net/search_json?search=${search}`
  );
  try {
    const body = (await response.json()) as DPDResult;
    await db
      .insert(dpdSearches)
      .values({
        search,
        dpdHtml: body.dpd_html,
        summaryHtml: body.summary_html,
      })
      .run();
    return json(body, responseConfig);
  } catch (error) {
    return json(error);
  }
};
