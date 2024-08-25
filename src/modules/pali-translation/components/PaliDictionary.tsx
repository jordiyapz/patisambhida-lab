import clsx from "clsx";
import parse from "node-html-parser";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNewPaliStore } from "@/modules/pali-translation/lib/pali-store";

import { queryKeys } from "../lib/queries";
import { velthuisToUni } from "../lib/utils";
import { fetchDPDict } from "../lib/services";
import dpdQueryClient from "../lib/dpd-query-client";

type Props = {
  className: string;
};

function PaliDictionary({ ...props }: Props) {
  const [search, setSearch] = useNewPaliStore(
    useShallow((s) => [s.search, s.setSearch])
  );
  const [inputValue, setInputValue] = useState(search);

  useEffect(() => setInputValue(search), [search]);

  const { status, data, error, isLoading, refetch } = useQuery(
    {
      queryKey: queryKeys.dictByQ(search),
      queryFn: () => fetchDPDict(search),
      enabled: search !== "",
      retry: 10,
    },
    dpdQueryClient
  );

  useEffect(() => {
    if (data === "Internal Server Error") refetch();
  }, [data, refetch]);

  const dom = data
    ? parse(data, { blockTextElements: { style: false } })
    : null;

  return (
    <div {...props} className={clsx("flex flex-col gap-2", props.className)}>
      <div className="border border-slate-800 w-full flex-grow h-full">
        <div className="px-4 py-2 font-bold bg-slate-900">
          Digital Pāḷi Dictionary
        </div>
        <form
          className="flex w-full items-center space-x-2 p-2"
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(inputValue);
          }}
        >
          <Input
            placeholder="Search..."
            value={inputValue}
            onChange={(e) => setInputValue(velthuisToUni(e.target.value))}
          />
          <Button type="submit">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Search"
            )}
          </Button>
        </form>
        {/* <Separator className="px-2"/> */}
        {status === "pending" ? (
          <div className="mt-5 text-center">
            {isLoading ? "Loading..." : "No data"}
          </div>
        ) : status === "error" ? (
          <pre>{error.message}</pre>
        ) : (
          <div
            id="dpd-result"
            className="p-4 pt-2 flex flex-col justify-stretch overflow-y-auto max-h-[70dvh]"
            dangerouslySetInnerHTML={{
              __html: dom?.innerHTML ?? "Failed to load data",
            }}
          ></div>
        )}
      </div>
    </div>
  );
}
export default PaliDictionary;
