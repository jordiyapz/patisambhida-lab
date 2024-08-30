import clsx from "clsx";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useState, type MouseEventHandler } from "react";
import { useShallow } from "zustand/react/shallow";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import HamburgerButton from "@/components/ui/HamburgerButton";

import { useNewPaliStore } from "../lib/pali-store";
import { removePunctuation, type Token } from "../lib/utils";

type Props = { token: Token; row: number; col: number };
function TokenCard({ token, row, col }: Props) {
  const [setSearch, setTokenCase, setTokenMeaning, setTokenAlt] =
    useNewPaliStore(
      useShallow((s) => [
        s.setSearch,
        s.setTokenCase,
        s.setTokenMeaning,
        s.setTokenAlt,
      ])
    );
  const [alt, setAlt] = useState({ show: !!token.alt, edit: false });

  const handleWordSearch =
    (word: string): MouseEventHandler<HTMLSpanElement> =>
    () => {
      setSearch(removePunctuation(word));
    };

  const handleSetAlt = (text: string) => {
    if (text === "") {
      setTokenAlt([row, col]);
      setAlt({ edit: false, show: true });
    } else {
      setTokenAlt([row, col], text);
      setAlt({ edit: false, show: true });
    }
  };

  return (
    <DropdownMenu>
      <div className="group relative flex flex-col p-1 rounded hover:outline-dashed outline-slate-800">
        {alt.edit ? (
          <Input
            autoCapitalize="none"
            className={clsx(
              "text-sm min-w-6 p-0 h-6 mb-1 text-white rounded-sm"
            )}
            defaultValue={token.alt ?? token.symbol}
            onBlur={(e) => handleSetAlt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                console.debug(e.currentTarget.value);
                handleSetAlt(e.currentTarget.value);
              }
              if (e.key === "Esc") {
                setAlt((s) => ({ ...s, edit: false }));
              }
            }}
          />
        ) : (
          <span
            className="cursor-pointer hover:text-green-400"
            onClick={handleWordSearch(token.symbol)}
          >
            {alt.show ? token.alt ?? token.symbol : token.symbol}
          </span>
        )}
        <Input
          autoCapitalize="none"
          className={clsx(
            "text-sm min-w-6 p-0 h-5 text-yellow-300 rounded-sm",
            token?.case ? "border-hidden hover:border-solid" : "w-20"
          )}
          size={token?.case.length ?? 5}
          placeholder="case..."
          value={token?.case}
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
        {!alt.edit && (
          <DropdownMenuTrigger asChild>
            <div className="absolute top-1 right-1">
              <HamburgerButton />
            </div>
          </DropdownMenuTrigger>
        )}
      </div>
      <DropdownMenuContent className="bg-slate-900 p-2 border border-slate-600 rounded">
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setAlt((s) => ({ ...s, edit: true }))}>
          {token.alt ? (
            <PencilIcon className="h-4 w-4" />
          ) : (
            <PlusIcon className="h-4 w-4" />
          )}
          <span className="ml-1">{token.alt ? "Edit" : "Add"} alternative</span>
        </DropdownMenuItem>

        {token.alt && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={alt.show}
              onCheckedChange={(checked) => {
                setAlt((s) => ({ ...s, show: checked }));
              }}
            >
              Use alternative
            </DropdownMenuCheckboxItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default TokenCard;
