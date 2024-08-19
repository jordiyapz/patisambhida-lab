import React from "react";
import { useDrop } from "react-dnd";
import { ItemTypes, type XY } from "./constants";
import clsx from "clsx";
import Square from "./Square";

type Props = {
  children: React.ReactNode;
  coord: XY;
  knightPosition: XY;
  onDrop?: (x: number, y: number) => void;
};

export default function BoardSquare({
  coord,
  knightPosition,
  children,
  onDrop,
}: Props) {
  const [x, y] = coord;
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.KNIGHT,
      drop: () => onDrop?.(x, y),
      canDrop: () => canMoveKnight(knightPosition, coord),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [coord, onDrop]
  );

  const black = (x + y) % 2 === 1;

  return (
    <div ref={drop} className="relative w-full h-full">
      <Square black={black}>{children}</Square>
      {isOver && !canDrop && <Overlay color="red" />}
      {!isOver && canDrop && <Overlay color="yellow" />}
      {isOver && canDrop && <Overlay color="green" />}
    </div>
  );
}

function Overlay({ color = "yellow" }: { color?: string }) {
  return (
    <div
      className={clsx(
        "absolute top-0 left-0 h-full w-full z-[1] opacity-50",
        `bg-${color}-500`
      )}
    />
  );
}

function canMoveKnight(from: XY, to: XY): boolean {
  const [x, y] = from;
  const dx = to[0] - x;
  const dy = to[1] - y;

  return (
    (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
    (Math.abs(dx) === 1 && Math.abs(dy) === 2)
  );
}
