import { ScrollArea } from "@radix-ui/react-scroll-area";
import PaliSheetList from "./PaliSheetList";
import clsx from "clsx";

type Props = { sheetId?: number; className?: string };

function LeftDrawer({ className, sheetId }: Props) {
  return (
    <div
      className={clsx(
        "flex flex-col h-[calc(100dvh-3.5rem)] pb-4 px-2 bg-white dark:bg-gray-900",
        className
      )}
    >
      <div className="flex pt-4 mb-2 justify-between">
        <span className="font-bold text-xl">Notes</span>
      </div>
      <PaliSheetList activeId={sheetId} />
    </div>
  );
}
export default LeftDrawer;
