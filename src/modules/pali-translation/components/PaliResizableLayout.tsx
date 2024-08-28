import { useQuery } from "@tanstack/react-query";
import flagsmith from "flagsmith";
import { FlagsmithProvider } from "flagsmith/react";

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
      <ResizableHandle withHandle />
      <ResizablePanel>
        <ScrollArea className="h-[calc(100dvh-3.5rem)]">
          {isEditing ? (
            <PaliTranscriptEditor
              sheet={sheet}
              onApplied={() => setEditing(false)}
            />
          ) : (
            <FlagsmithProvider
              options={{ environmentID: "X8t4dP7Vh5PbytNZZVumSp" }}
              flagsmith={flagsmith}
            >
              <PaliTokenEditor sheet={sheet} onEdit={() => setEditing(true)} />
            </FlagsmithProvider>
          )}
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <PaliDictionary className="h-[calc(100dvh-3.5rem)] top-14 right-0" />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
export default PaliResizableLayout;
