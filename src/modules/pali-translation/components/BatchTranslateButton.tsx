import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useQueries, type QueryOptions } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";

import { queryKeys } from "../lib/queries";
import { fetchDPDict } from "../lib/services";
import { useNewPaliStore } from "../lib/pali-store";
import dpdQueryClient from "../lib/dpd-query-client";
import { removePunctuation, type Token } from "../lib/utils";

function BatchTranslateButton() {
  const lines = useNewPaliStore(useShallow((s) => s.lines));
  const [shouldBatch, setShouldBatch] = useState(false);

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

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={shouldBatch}
      onClick={() => setShouldBatch(true)}
    >
      {status.includes("pending")
        ? "Fetching..."
        : status.includes("success")
        ? "Fetched"
        : "Fetch all translations"}
    </Button>
  );
}
export default BatchTranslateButton;
