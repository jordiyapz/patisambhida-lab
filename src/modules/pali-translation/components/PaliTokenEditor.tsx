import { useShallow } from "zustand/react/shallow";
import { useEffect, type MouseEventHandler } from "react";
import clsx from "clsx";
import type { Sheet } from "@/db/schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useNewPaliStore } from "../lib/pali-store";
import type { SheetWithAuthor } from "../lib/dto";

type Props = { sheet: Sheet | SheetWithAuthor };
function PaliTokenEditor({ sheet }: Props) {
  const [
    lines,
    initializeLines,
    setLines,
    setLineSummary,
    setTokenCase,
    setTokenMeaning,
  ] = useNewPaliStore(
    useShallow((s) => [
      s.lines,
      s.initializeLines,
      s.setLines,
      s.setLineSummary,
      s.setTokenCase,
      s.setTokenMeaning,
    ])
  );

  const [setSearch] = useNewPaliStore(useShallow((s) => [s.setSearch]));

  useEffect(() => {
    const transcript = sheet.transcript ?? "";
    const translation = JSON.parse(sheet.translation as string);

    if (!translation) initializeLines(transcript);
    else setLines(translation);
  }, [sheet]);

  const handleWordSearch: MouseEventHandler<HTMLSpanElement> = (e) => {
    setSearch(
      // Remove all punctuations
      e.currentTarget.innerText.replaceAll(
        /[\u104a\u104b\u2018\u2019",\.\?]/g,
        ""
      )
    );
  };

  return (
    <div className="mt-2 pb-6 px-3 text-md overflow-auto">
      {lines.map((line, row) => (
        <div key={row} className="flex max-w-full flex-wrap gap-2 mb-4">
          {line.tokens.map((token, index) => {
            // const token = lines.find((t) => t.row === row && t.index === index);

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
                    token?.meaning ? "border-hidden hover:border-solid" : "w-20"
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
  );
}
export default PaliTokenEditor;
