import type { InsertSheet, Sheet } from "@/db/schema";
import type { SheetWithAuthor } from "@/modules/pali-translation/lib/dto";
import { jsonHeaders, type Line } from "./utils";

export const fetchDPDict = async (search: string) => {
  const url = `https://corsmirror.onrender.com/v1/cors?url=${encodeURIComponent(
    `https://www.dpdict.net/gd?search=${encodeURI(search)}`
  )}`;
  const dom = await fetch(url).then((res) => res.text());
  return dom;
};

export async function fetchPaliSheets(baseUrl: URL | string = "") {
  try {
    console.log({ baseUrl });
    const url = "/api/pali/sheets";
    const sheets: SheetWithAuthor[] = await fetch(
      baseUrl ? new URL(url, baseUrl) : url
    ).then((res) => res.json());
    return sheets;
  } catch (error) {
    console.error((error as any).message);
    return [];
  }
}

export async function createPaliSheet(payload: InsertSheet) {
  return fetch("/api/pali/sheets", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  }).then((r) => r.json() as Promise<SheetWithAuthor>);
}

export async function updatePaliSheet(
  id: Sheet["id"],
  data: Partial<Omit<Sheet, "id">>
) {
  return fetch("/api/pali/sheets/" + id, {
    method: "PATCH",
    headers: jsonHeaders,
    body: JSON.stringify(data),
  }).then((r) => r.json() as Promise<Sheet>);
}

export async function updateTranslation(id: Sheet["id"], data: Line[]) {
  return updatePaliSheet(id, { translation: JSON.stringify(data) });
}

// TODO: implement updateTranscript
export async function updateTranscript(id: Sheet["id"], data: string) {
  return updatePaliSheet(id, {
    transcript: data,
    // TODO: handle token movement
    // translation: JSON.stringify(),
  });
}
