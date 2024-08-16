"use client";

import { useMemo, useState } from "react";
import { Edit } from "lucide-react";
import clsx from "clsx";
import { usePaliStore } from "@/modules/pali-translation/lib/pali-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = { className: string };

function PaliEditor({ className }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const setSearch = usePaliStore((state) => state.setSearch);
  const transcript = usePaliStore((s) => s.transcript);
  const setTranscript = usePaliStore((s) => s.setTranscript);

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
          value={transcript}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setTranscript(e.target.value);
          }}
        />
      ) : (
        <div className="py-6 px-3 text-md max-w-full">
          {lines.map((tokens, i) => (
            <div key={i} className="flex max-w-full flex-wrap gap-1">
              {tokens.map((word, i) => (
                <span
                  key={word+i}
                  className="block h-14 cursor-pointer hover:text-green-400"
                  onClick={(e) => {
                    setSearch(
                      e.currentTarget.innerText.replaceAll(
                        /[\u104a\u104b\u2018\u2019",\.\?]/g,
                        ""
                      )
                    );
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
