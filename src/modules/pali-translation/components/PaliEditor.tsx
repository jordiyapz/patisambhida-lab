import { useEffect, useMemo, useState, type KeyboardEventHandler } from "react";
import { useShallow } from "zustand/react/shallow";
import { useQuery } from "@tanstack/react-query";
import { Edit, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import clsx from "clsx";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Sheet } from "@/db/schema";

import {
  fetchPaliSheets,
  updatePaliSheet,
  updateTranslation,
} from "../lib/services";
import { queryKeys } from "../lib/queries";
import queryClient from "../lib/query-client";
import { useNewPaliStore } from "../lib/pali-store";
import PaliTranscriptInput from "./PaliTranscriptInput";
import PaliTokenEditor from "./PaliTokenEditor";

const featureFlags = {
  enableEdit: false,
};

type Props = { className: string; sheetId: Sheet["id"] };
interface Values {
  title: string;
  transcript: string;
}

function PaliEditor({ className, sheetId }: Props) {
  const { data: sheets } = useQuery(
    { queryKey: queryKeys.listSheets, queryFn: () => fetchPaliSheets() },
    queryClient
  );

  const sheet = sheets?.find((s) => s.id === sheetId);

  const [isEditing, setIsEditing] = useState(false);
  const [lines] = useNewPaliStore(useShallow((s) => [s.lines]));

  const defaultValues = useMemo(
    () => ({
      title: sheet?.title ?? "",
      transcript: sheet?.transcript ?? "",
    }),
    [sheet]
  );

  const { register, handleSubmit, trigger, reset } = useForm<Values>({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
    if (sheet && !sheet.transcript) setIsEditing(true);
  }, [sheet]);

  const updateTranscript = async (data: Values) => {
    if (!sheet) return;
    await toast.promise(updatePaliSheet(sheet.id, data), {
      error: (err) => "Error: " + err.message,
      loading: "Loading...",
      success: (res) => `Note "${res.title}" updated!`,
    });
    queryClient.invalidateQueries({ queryKey: queryKeys.listSheets });
    setIsEditing(false);
  };

  const overwriteTranslation = async () => {
    if (!sheet) return;
    await toast.promise(updateTranslation(sheet.id, lines), {
      error: (err) => "Error: " + err.message,
      loading: "Loading...",
      success: `Note "${sheet.title}" updated!`,
    });
    queryClient.invalidateQueries({ queryKey: queryKeys.listSheets });
  };

  const handleKeyDown: KeyboardEventHandler = async (event) => {
    if (event.ctrlKey && event.key === "Enter") {
      event.preventDefault(); // Prevent the default behavior of Enter
      const isValid = await trigger();
      if (isValid) {
        handleSubmit(updateTranscript)();
      }
    }
  };

  return (
    <form
      className={clsx("px-2 pb-3", className)}
      onSubmit={handleSubmit(updateTranscript)}
    >
      <div className="flex justify-between items-center py-2 gap-3">
        {isEditing ? (
          <Input
            {...register("title")}
            placeholder="Title"
            onKeyDown={handleKeyDown}
          />
        ) : (
          <p className="ms-3 text-lg">{sheet?.title}</p>
        )}
        <div>
          {isEditing ? (
            <Button type="submit" className="bg-green-500 hover:bg-green-400">
              Apply <pre className="text-xs ml-1 align-super">[Ctrl+Enter]</pre>
            </Button>
          ) : (
            <>
              {featureFlags.enableEdit && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditing(true);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
              )}
              <Button
                type="button"
                className="bg-green-500 hover:bg-green-300"
                onClick={overwriteTranslation}
              >
                <Save className="mr-2 h-4 w-4" /> Save
              </Button>
            </>
          )}
        </div>
      </div>
      {isEditing ? (
        <PaliTranscriptInput
          {...register("transcript")}
          onKeyDown={handleKeyDown}
        />
      ) : (
        sheet && <PaliTokenEditor sheet={sheet} />
      )}
    </form>
  );
}
export default PaliEditor;
