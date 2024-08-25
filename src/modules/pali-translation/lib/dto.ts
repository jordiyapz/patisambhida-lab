import type { Sheet, User } from "@/db/schema";

export interface SheetWithAuthor extends Omit<Sheet, "author"> {
  author: User | null;
}
