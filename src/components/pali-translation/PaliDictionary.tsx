import clsx from "clsx";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { usePaliStore } from "@/lib/pali-store";

type Props = {
  className: string;
};

function PaliDictionary({ ...props }: Props) {
  const [loading, setLoading] = useState(true);
  const search = usePaliStore((state) => state.search);
  const setSearch = usePaliStore((state) => state.setSearch);

  return (
    <div {...props} className={clsx("flex flex-col gap-2", props.className)}>
      <form
        className="flex w-full items-center space-x-2"
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(search);
          setLoading(true);
        }}
      >
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button type="submit">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...
            </>
          ) : (
            "Search"
          )}
        </Button>
      </form>
      <iframe
        className="border border-slate-800 w-full rounded-md flex-grow"
        src={`https://corsmirror.onrender.com/v1/cors?url=${encodeURIComponent(
          `https://www.dpdict.net/gd?search=${encodeURI(search)}`
        )}`}
        onLoad={() => {
          setLoading(false);
        }}
      />
    </div>
  );
}
export default PaliDictionary;
