import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { usePaliStore } from "@/modules/pali-translation/lib/pali-store";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchDPDict } from "../lib/services";
import { Separator } from "@/components/ui/separator";

type Props = {
  className: string;
};

function PaliDictionary({ ...props }: Props) {
  const search = usePaliStore((state) => state.search);
  const setSearch = usePaliStore((state) => state.setSearch);

  const { status, data, error, isLoading } = useQuery({
    queryKey: ["dict-search", { q: search }],
    queryFn: () => fetchDPDict(search),
    enabled: search !== "",
  });

  return (
    <div {...props} className={clsx("flex flex-col gap-2", props.className)}>
      <form
        className="flex w-full items-center space-x-2"
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(search);
        }}
      >
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button type="submit">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...
            </>
          ) : (
            "Search"
          )}
        </Button>
      </form>
      <div className="border border-slate-800 w-full rounded-md flex-grow ">
        <div className="px-4 py-2 font-bold bg-slate-900 rounded-t-md">
          Digital Pāḷi Dictionary
        </div>
        <Separator />
        <div
          className="px-4 py-2 flex flex-col justify-stretch"
          dangerouslySetInnerHTML={{
            __html:
              status === "pending"
                ? `<div class='mt-5 text-center'>${
                    isLoading ? "Loading..." : "No data"
                  }</div>`
                : status === "error"
                ? `<pre>${error?.message}</pre>`
                : data.grammarDict?.innerHTML ??
                  data.dom.innerHTML,
          }}
        ></div>
      </div>
    </div>
  );
}
export default PaliDictionary;
