import clsx from "clsx";
import React, { type ReactNode } from "react";

type Props = {
  black: boolean;
  children: ReactNode;
  className?: string;
};

export default function Square({ black, children, className }: Props) {
  return (
    <div
      className={clsx(
        "w-full h-full min-w-6 min-h-6 bg-white text-black",
        black && "bg-black text-white",
        className
      )}
    >
      {children}
    </div>
  );
}
