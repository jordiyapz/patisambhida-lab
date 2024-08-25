import type { Sheet } from "@/db/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

import PaliDictionary from "./PaliDictionary";
import PaliEditor from "./PaliEditor";
import LeftDrawer from "./LeftDrawer";

type Props = { sheetId: Sheet["id"] };
function PaliResizableLayout({ sheetId }: Props) {
  return (
    <ResizablePanelGroup direction="horizontal" autoSaveId="pali-translation-3">
      <ResizablePanel>
        <LeftDrawer sheetId={sheetId} />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <ScrollArea>
          <PaliEditor className="h-[calc(100vh-3.5rem)]" sheetId={sheetId} />
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
