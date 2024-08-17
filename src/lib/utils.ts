import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string): string {
  const sp = str.split(" ");
  if (sp.length > 1) return sp.map(capitalize).join(" ");
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}
