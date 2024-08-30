import toast from "react-hot-toast";
import { Edit, Save } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { useFlags } from "flagsmith/react";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";

import type { Sheet } from "@/db/schema";
import Tooltip from "@/components/ui/Tooltip";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { queryKeys } from "../lib/queries";
import queryClient from "../lib/query-client";
import type { SheetWithAuthor } from "../lib/dto";
import { useNewPaliStore } from "../lib/pali-store";
import { updateTranslation } from "../lib/services";
import BatchTranslateButton from "./BatchTranslateButton";
import TokenCard from "./TokenCard";

type Props = { sheet?: Sheet | SheetWithAuthor; onEdit?(): void };

function PaliTokenEditor({ sheet, onEdit }: Props) {
  const [lines, initializeLines, setLines, setLineSummary] = useNewPaliStore(
    useShallow((s) => [
      s.lines,
      s.initializeLines,
      s.setLines,
      s.setLineSummary,
    ])
  );
  const flags = useFlags(["pali/transcript_editable"]);
  const enableEdit = flags["pali/transcript_editable"].enabled;

  const isMobile = useMediaQuery({ maxWidth: 767 });

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

  return (
    <div>
      <div className="flex justify-between items-center py-2 pr-3 gap-3">
        <p className="ms-3 text-lg">{sheet?.title}</p>
        <div className="flex gap-1">
          {enableEdit && (
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
          <BatchTranslateButton />
          <Button
            type="button"
            size="sm"
            className="group relative bg-green-500 hover:bg-green-300"
            onClick={overwriteTranslation}
          >
            <Save className="h-4 w-4" />
            {!isMobile && <span className="ml-1">Save</span>}
            {isMobile && <Tooltip title="Save" pos="bottom" />}
          </Button>
        </div>
      </div>
      <div className="pt-2 pb-6 px-3 text-md overflow-auto">
        {lines.map((line, row) => (
          <div key={row} className="flex max-w-full flex-wrap gap-2 mb-4">
            {line.tokens.map((token, index) => (
              <TokenCard key={index} token={token} row={row} col={index} />
            ))}
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
