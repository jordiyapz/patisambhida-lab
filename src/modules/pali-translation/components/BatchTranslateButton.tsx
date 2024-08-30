import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useQueries, type QueryOptions } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";

import { queryKeys } from "../lib/queries";
import { fetchDPDict } from "../lib/services";
import { useNewPaliStore } from "../lib/pali-store";
import dpdQueryClient from "../lib/dpd-query-client";
import { removePunctuation, type Token } from "../lib/utils";
import { useMediaQuery } from "react-responsive";
import clsx from "clsx";
import { CloudDownloadIcon, DatabaseIcon, DownloadIcon } from "lucide-react";
import Tooltip from "@/components/ui/Tooltip";
import Loader from "@/components/ui/Loader";

function BatchTranslateButton() {
  const lines = useNewPaliStore(useShallow((s) => s.lines));
  const [shouldBatch, setShouldBatch] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const uniqueSymbols = useMemo(() => {
    const tokens = lines
      .map((line) => line.tokens)
      .reduce((acc, line) => [...acc, ...line], [] as Token[]);
    return [...new Set(tokens.map((t) => removePunctuation(t.symbol)))];
  }, [lines]);

  const translationsQueries = useQueries(
    {
      queries: shouldBatch
        ? uniqueSymbols.map((symbol) => {
            return {
              queryKey: queryKeys.dictByQ(symbol),
              queryFn: () => fetchDPDict(symbol),
              retry: 10,
            } satisfies QueryOptions;
          })
        : [],
    },
    dpdQueryClient
  );

  const status = useMemo(
    () => [...new Set(translationsQueries.map((v) => v.status))],
    [translationsQueries]
  );

  const defaultText = "Fetch all translations";
  const buttonText = status.includes("pending")
    ? "Fetching..."
    : status.includes("success")
    ? "Fetched"
    : defaultText;

  return (
    <Button
      size="sm"
      className={clsx(isMobile && "w-10")}
      variant="outline"
      disabled={shouldBatch}
      onClick={() => setShouldBatch(true)}
    >
      {status.includes("pending") ? (
        <Loader size="sm" />
      ) : (
        <CloudDownloadIcon className="h-4 w-4" />
      )}
      {!isMobile && <span className="ml-1">{buttonText}</span>}
      {isMobile && <Tooltip pos="bottom" title={defaultText} />}
    </Button>
  );
}
export default BatchTranslateButton;
