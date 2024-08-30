import { useShallow } from "zustand/react/shallow";
import type { MouseEventHandler } from "react";
import clsx from "clsx";
import { Input } from "@/components/ui/input";
import { removePunctuation, type Token } from "../lib/utils";
import { useNewPaliStore } from "../lib/pali-store";

type Props = { token: Token; row: number; col: number };
function TokenCard({ token, row, col }: Props) {
  const [setSearch, setTokenCase, setTokenMeaning] = useNewPaliStore(
    useShallow((s) => [s.setSearch, s.setTokenCase, s.setTokenMeaning])
  );

  const handleWordSearch: MouseEventHandler<HTMLSpanElement> = (e) => {
    setSearch(removePunctuation(e.currentTarget.innerText));
  };

  return (
    <div className="flex flex-col p-1 rounded hover:outline-dashed outline-slate-800">
      <span
        className="cursor-pointer hover:text-green-400"
        onClick={handleWordSearch}
      >
        {token.symbol}
      </span>
      <Input
        autoCapitalize="none"
        className={clsx(
          "text-sm min-w-6 p-0 h-5 text-yellow-300 rounded-sm",
          token?.case ? "border-hidden hover:border-solid" : "w-20"
        )}
        size={token?.case.length ?? 5}
        placeholder="case..."
        value={token?.case ?? ""}
        onChange={(e) => setTokenCase([row, col], e.target.value)}
      />
      <Input
        autoCapitalize="none"
        size={token?.meaning.length ?? 5}
        className={clsx(
          "text-sm min-w-6 p-0 h-5 rounded-sm text-slate-500",
          token?.meaning ? "border-hidden hover:border-solid" : "w-20"
        )}
        placeholder="meaning..."
        value={token?.meaning ?? ""}
        onChange={(e) => setTokenMeaning([row, col], e.target.value)}
      />
    </div>
  );
}
export default TokenCard;
