import type { Sheet, User } from "@/db/schema";

export interface SheetWithAuthor extends Omit<Sheet, "author"> {
  author: User | null;
}

export interface DPDResult {
  dpd_html: string;
  summary_html: string;
}
