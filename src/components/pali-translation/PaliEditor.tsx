"use clien";

import { useMemo, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Edit } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import clsx from "clsx";

type Props = { className: string; onSearch(text: string): void };

const initialText = `domanassasahagataṃ paṭighasampayuttaṃ asaṅkhārikamekaṃ, sasaṅkhārikamekanti imāni dvepi paṭighasampayuttacittāni nāma.
upekkhāsahagataṃ vicikicchāsampayuttamekaṃ, upekkhāsahagataṃ uddhaccasampayuttamekanti imāni dvepi momūhacittāni nāma.`;
function PaliEditor({ className, onSearch: setSearch }: Props) {
  const [rawText, setRawText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);

  const lines = useMemo(() => {
    return rawText.split("\n").map((x) => x.split(" "));
  }, [rawText]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    if (event.ctrlKey && event.key === "Enter") {
      event.preventDefault(); // Prevent the default behavior of Enter
      setIsEditing(false);
    }
  };

  return (
    <div
      className={clsx(
        "flex flex-col px-2 pb-3 border border-slate-800 rounded-md h-[80vh]",
        className
      )}
    >
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
          className="flex-grow text-md leading-[3.5rem]"
          placeholder="Write pali script here..."
          value={rawText}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setRawText(e.target.value);
          }}
        />
      ) : (
        <div className="py-6 px-3 text-md max-w-full">
          {lines.map((tokens) => (
            <div className="flex max-w-full flex-wrap gap-1">
              {tokens.map((word) => (
                <span
                  className="block h-14 cursor-pointer hover:text-green-400"
                  onClick={(e) => {
                    setSearch(e.currentTarget.innerText);
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default PaliEditor;
