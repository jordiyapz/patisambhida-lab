import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import type { SheetWithAuthor } from "../lib/dto";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../lib/queries";
import queryClient from "../lib/query-client";
import { createPaliSheet, fetchPaliSheets } from "../lib/services";

interface Values {
  title: string;
}

type Props = { activeId?: number };
function PaliSheetList({ activeId }: Props) {
  const [isCreating, setCreating] = useState(false);
  const { handleSubmit, register } = useForm<Values>({});
  const { data } = useQuery(
    { queryKey: queryKeys.listSheets, queryFn: () => fetchPaliSheets() },
    queryClient
  );
  const sheets = data ?? [];

  const createSheet = async ({ title }: Values) => {
    const res = await toast.promise<SheetWithAuthor>(
      createPaliSheet({ title }),
      {
        loading: "Creating...",
        success: "New sheet created",
        error: (err) => `Error: ${err.message}`,
      }
    );
    setTimeout(
      () => window.location.assign(window.location.origin + "/pali/" + res.id),
      500
    );
  };

  return (
    <ul className="space-y-2 font-medium">
      {!isCreating ? (
        <Button
          variant="outline"
          className="w-full bg-slate-700 hover:bg-slate-600"
          onClick={() => {
            setCreating((s) => !s);
          }}
        >
          Create note
        </Button>
      ) : (
        <form
          className="grid w-full max-w-sm items-center gap-1.5 border border-slate-400 p-4 rounded-md"
          method="POST"
          action="/api/pali/sheets"
          onSubmit={handleSubmit(createSheet)}
        >
          <Label htmlFor="title">Note title</Label>
          <Input {...register("title")} placeholder="Title" />
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="hover:text-red-500 hover:bg-transparent"
              onClick={() => setCreating(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-green-500 hover:bg-green-400"
            >
              Create
            </Button>
          </div>
        </form>
      )}
      {sheets.map((sheet) => (
        <li key={sheet.id}>
          <a
            href={`${sheet.id}`}
            className={clsx(
              "flex items-center p-2 text-gray-900 rounded-md dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group border border-slate-600",
              Number(activeId) === sheet.id && "border-2 border-green-600"
            )}
          >
            <div className="w-full">
              <span className="font-bold">{sheet.title}</span>
              {sheet.author && (
                <div className="text-xs pl-2 border-l-2 border-gray-400 text-gray-400">
                  by {sheet.author.username ?? "unknown"}
                </div>
              )}
              {/* <Separator className="w-full dark:bg-slate-100"/> */}
              <div className="mt-2 text-sm line-clamp-3 ms-2">
                {sheet.transcript?.split("\\n").map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
              {sheet.updatedAt && (
                <div className="mt-1 text-xs text-right text-gray-400">
                  Updated: {dayjs(sheet.updatedAt).format("MMM, DD | HH:mm")}
                </div>
              )}
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default PaliSheetList;
