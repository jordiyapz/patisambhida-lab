import { useShallow } from "zustand/react/shallow";
import { useMemo, type MouseEventHandler } from "react";
import clsx from "clsx";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePaliStore } from "../lib/pali-store";
import type { Sheet } from "@/db/schema";
import type { SheetWithAuthor } from "../lib/dto";

type Props = { sheet: Sheet | SheetWithAuthor };
function PaliTokenEditor({ sheet }: Props) {
  const [
    transcriptq,
    tokens,
    sentences,
    setSearch,
    setSentence,
    setTokenCase,
    setTokenMeaning,
  ] = usePaliStore(
    useShallow((s) => [
      s.transcript,
      s.tokens,
      s.sentences,
      s.setSearch,
      s.setSentence,
      s.setTokenCase,
      s.setTokenMeaning,
    ])
  );

  const transcript = sheet.transcript ?? "";

  const lines = useMemo(() => {
    return transcript.split("\n").map((x) => x.split(" "));
  }, [transcript]);

  const handleWordSearch: MouseEventHandler<HTMLSpanElement> = (e) => {
    setSearch(
      e.currentTarget.innerText.replaceAll(
        /[\u104a\u104b\u2018\u2019",\.\?]/g,
        ""
      )
    );
  };

  return (
    <div className="py-6 px-3 text-md overflow-auto">
      {lines.map((line, row) => (
        <div key={row} className="flex max-w-full flex-wrap gap-2 mb-4">
          {line.map((word, index) => {
            if (!word) return null;

            const token = tokens.find(
              (t) => t.row === row && t.index === index
            );

            return (
              <div key={word + index} className="h-16 flex flex-col">
                <span
                  className="cursor-pointer hover:text-green-400"
                  onClick={handleWordSearch}
                >
                  {word}
                </span>
                <Input
                  className={clsx(
                    "text-sm min-w-6 p-0 h-5 text-yellow-300 rounded-sm",
                    token?.case ? "border-hidden hover:border-solid" : "w-20"
                  )}
                  size={token?.case.length ?? 5}
                  placeholder="case..."
                  value={token?.case ?? ""}
                  onChange={(e) =>
                    setTokenCase({ row, index, value: e.target.value })
                  }
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
                    setTokenMeaning({ row, index, value: e.target.value })
                  }
                />
              </div>
            );
          })}
          <Textarea
            className="rounded-sm"
            value={sentences[row]}
            onChange={(e) => setSentence(row, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
export default PaliTokenEditor;
