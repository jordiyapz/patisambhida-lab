import { useEffect, useMemo, type KeyboardEventHandler } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import clsx from "clsx";

import type { Sheet } from "@/db/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { queryKeys } from "../lib/queries";
import { velthuisToUni } from "../lib/utils";
import queryClient from "../lib/query-client";
import type { SheetWithAuthor } from "../lib/dto";
import { updateTranscript } from "../lib/services";
import PaliTranscriptInput from "./PaliTranscriptInput";

type Props = {
  className?: string;
  sheet?: Sheet | SheetWithAuthor;
  onApplied?(): void;
};

interface Values {
  title: string;
  transcript: string;
}

function PaliTranscriptEditor({ className, sheet, onApplied }: Props) {
  const defaultValues = useMemo(
    () => ({
      title: sheet?.title ?? "",
      transcript: sheet?.transcript ?? "",
    }),
    [sheet]
  );

  const { register, handleSubmit, trigger, reset, control } = useForm<Values>({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [sheet]);

  const handleApply = async (data: Values) => {
    if (!sheet) return;
    await toast.promise(updateTranscript(sheet.id, data), {
      error: (err) => "Error: " + err.message,
      loading: "Loading...",
      success: (res) => `Note "${res.title}" updated!`,
    });
    queryClient.invalidateQueries({ queryKey: queryKeys.listSheets });
    onApplied?.();
  };

  const handleKeyDown: KeyboardEventHandler = async (event) => {
    if (event.ctrlKey && event.key === "Enter") {
      event.preventDefault(); // Prevent the default behavior of Enter
      const isValid = await trigger();
      if (isValid) {
        handleSubmit(handleApply)();
      }
    }
  };

  return (
    <form
      className={clsx("px-2 pb-3", className)}
      onSubmit={handleSubmit(handleApply)}
    >
      <div className="flex justify-between items-center py-2 gap-3">
        <Input
          {...register("title")}
          placeholder="Title"
          onKeyDown={handleKeyDown}
        />
        <div>
          <Button type="submit" className="bg-green-500 hover:bg-green-400">
            Apply <pre className="text-xs ml-1 align-super">[Ctrl+Enter]</pre>
          </Button>
        </div>
      </div>
      <Controller
        name="transcript"
        control={control}
        render={({ field }) => (
          <PaliTranscriptInput
            name="transcript"
            onKeyDown={handleKeyDown}
            value={field.value}
            onChange={(e) => {
              field.onChange(velthuisToUni(e.currentTarget.value));
            }}
          />
        )}
      />
    </form>
  );
}
export default PaliTranscriptEditor;
