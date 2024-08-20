import clsx from "clsx";
import { useMemo, useState, type MouseEventHandler } from "react";
import { Edit } from "lucide-react";
import { usePaliStore } from "@/modules/pali-translation/lib/pali-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

type Props = { className: string };

function PaliEditor({ className }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const transcript = usePaliStore((s) => s.transcript);
  const tokens = usePaliStore((s) => s.tokens);
  const sentences = usePaliStore((s) => s.sentences);
  const [setSearch, setTranscript, setTokenCase, setTokenMeaning, setSentence] =
    usePaliStore((s) => [
      s.setSearch,
      s.setTranscript,
      s.setTokenCase,
      s.setTokenMeaning,
      s.setSentence,
    ]);

  const lines = useMemo(() => {
    return transcript.split("\n").map((x) => x.split(" "));
  }, [transcript]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    if (event.ctrlKey && event.key === "Enter") {
      event.preventDefault(); // Prevent the default behavior of Enter
      setIsEditing(false);
    }
  };

  const handleWordSearch: MouseEventHandler<HTMLSpanElement> = (e) => {
    setSearch(
      e.currentTarget.innerText.replaceAll(
        /[\u104a\u104b\u2018\u2019",\.\?]/g,
        ""
      )
    );
  };
  return (
    <div className={clsx("px-2 pb-3", className)}>
      <div className="flex justify-end py-2">
        {isEditing ? (
          <Button
            className="bg-green-500 hover:bg-green-400"
            onClick={() => {
              setIsEditing(false);
            }}
          >
            Apply <pre className="text-xs ml-1 align-super">[Ctrl+Enter]</pre>
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={() => {
              setIsEditing(true);
            }}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
        )}
      </div>
      {isEditing ? (
        <Textarea
          id="pali-editor"
          className="flex-grow text-md leading-[4rem]"
          placeholder="Write pali script here..."
          value={transcript}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setTranscript(e.target.value);
          }}
        />
      ) : (
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
                        token?.case
                          ? "border-hidden hover:border-solid"
                          : "w-20"
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
                        token?.meaning
                          ? "border-hidden hover:border-solid"
                          : "w-20"
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
      )}
    </div>
  );
}
export default PaliEditor;
