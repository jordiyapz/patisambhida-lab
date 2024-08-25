import { useQuery } from "@tanstack/react-query";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import type { Sheet } from "@/db/schema";
import { ScrollArea } from "@/components/ui/scroll-area";

import LeftDrawer from "./LeftDrawer";
import { useEffect, useState } from "react";
import PaliDictionary from "./PaliDictionary";
import PaliTokenEditor from "./PaliTokenEditor";
import PaliTranscriptEditor from "./PaliTranscriptEditor";

import { queryKeys } from "../lib/queries";
import queryClient from "../lib/query-client";
import { fetchPaliSheets } from "../lib/services";

type Props = { sheetId: Sheet["id"] };
function PaliResizableLayout({ sheetId }: Props) {
  const [isEditing, setEditing] = useState(false);
  const { data: sheets } = useQuery(
    { queryKey: queryKeys.listSheets, queryFn: () => fetchPaliSheets() },
    queryClient
  );

  const sheet = sheets?.find((s) => s.id === sheetId);

  useEffect(() => {
    if (sheet && !sheet.transcript) setEditing(true);
  }, [sheet]);

  return (
    <ResizablePanelGroup direction="horizontal" autoSaveId="pali-translation-3">
      <ResizablePanel>
        <LeftDrawer sheetId={sheetId} />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <ScrollArea className="h-[calc(100vh-3.5rem)]">
          {isEditing ? (
            <PaliTranscriptEditor
              sheet={sheet}
              onApplied={() => setEditing(false)}
            />
          ) : (
            <PaliTokenEditor sheet={sheet} onEdit={() => setEditing(true)} />
          )}
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <PaliDictionary className="h-[calc(100vh-3.5rem)] top-14 right-0" />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
export default PaliResizableLayout;
