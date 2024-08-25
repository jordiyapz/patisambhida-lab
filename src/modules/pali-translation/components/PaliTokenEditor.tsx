import clsx from "clsx";
import toast from "react-hot-toast";
import { Edit, Save } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { useEffect, type MouseEventHandler } from "react";

import type { Sheet } from "@/db/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { featureFlags } from "../config";
import { queryKeys } from "../lib/queries";
import queryClient from "../lib/query-client";
import { removePunctuation } from "../lib/utils";
import type { SheetWithAuthor } from "../lib/dto";
import { useNewPaliStore } from "../lib/pali-store";
import { updateTranslation } from "../lib/services";

type Props = { sheet?: Sheet | SheetWithAuthor; onEdit?(): void };

function PaliTokenEditor({ sheet, onEdit }: Props) {
  const [
    setSearch,
    lines,
    initializeLines,
    setLines,
    setLineSummary,
    setTokenCase,
    setTokenMeaning,
  ] = useNewPaliStore(
    useShallow((s) => [
      s.setSearch,
      s.lines,
      s.initializeLines,
      s.setLines,
      s.setLineSummary,
      s.setTokenCase,
      s.setTokenMeaning,
    ])
  );

  useEffect(() => {
    if (sheet) {
      const transcript = sheet.transcript ?? "";
      const translation = JSON.parse(sheet.translation as string);
      if (!translation) initializeLines(transcript);
      else setLines(translation);
    }
  }, [sheet]);

  const overwriteTranslation = async () => {
    if (!sheet) return;
    await toast.promise(updateTranslation(sheet.id, lines), {
      error: (err) => "Error: " + err.message,
      loading: "Loading...",
      success: `Note "${sheet.title}" updated!`,
    });
    queryClient.invalidateQueries({ queryKey: queryKeys.listSheets });
  };

  const handleWordSearch: MouseEventHandler<HTMLSpanElement> = (e) => {
    setSearch(removePunctuation(e.currentTarget.innerText));
  };

  return (
    <div>
      <div className="flex justify-between items-center py-2 pr-3 gap-3">
        <p className="ms-3 text-lg">{sheet?.title}</p>
        <div>
          {featureFlags.enableEdit && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                onEdit?.();
              }}
            >
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            className="bg-green-500 hover:bg-green-300"
            onClick={overwriteTranslation}
          >
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
        </div>
      </div>
      <div className="mt-2 pb-6 px-3 text-md overflow-auto">
        {lines.map((line, row) => (
          <div key={row} className="flex max-w-full flex-wrap gap-2 mb-4">
            {line.tokens.map((token, index) => {
              return (
                <div key={index} className="h-16 flex flex-col">
                  <span
                    className="cursor-pointer hover:text-green-400"
                    onClick={handleWordSearch}
                  >
                    {token.symbol}
                  </span>
                  <Input
                    className={clsx(
                      "text-sm min-w-6 p-0 h-5 text-yellow-300 rounded-sm",
                      token?.case ? "border-hidden hover:border-solid" : "w-20"
                    )}
                    size={token?.case.length ?? 5}
                    placeholder="case..."
                    value={token?.case ?? ""}
                    onChange={(e) => setTokenCase([row, index], e.target.value)}
                  />
                  <Input
                    size={token?.meaning.length ?? 5}
                    className={clsx(
                      "text-sm min-w-6 p-0 h-5 rounded-sm text-slate-500",
                      token?.meaning
                        ? "border-hidden hover:border-solid"
                        : "w-20"
                    )}
                    placeholder="meaning..."
                    value={token?.meaning ?? ""}
                    onChange={(e) =>
                      setTokenMeaning([row, index], e.target.value)
                    }
                  />
                </div>
              );
            })}
            <Textarea
              className="rounded-sm"
              value={line.summary}
              placeholder="Line summary..."
              onChange={(e) => setLineSummary(row, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
export default PaliTokenEditor;
