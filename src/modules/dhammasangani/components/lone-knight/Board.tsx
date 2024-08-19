import BoardSquare from "../lone-knight/BoardSquare";
import type { XY } from "../lone-knight/constants";
import Knight from "./Knight";

type Props = {
  knightPosition: XY;
  onSquareClick?: (x: number, y: number) => void;
};

export default function Board({ knightPosition, onSquareClick }: Props) {
  const squares = [];
  for (let i = 0; i < 64; i++) {
    squares.push(renderSquare(i, knightPosition, onSquareClick));
  }

  return <div className="w-96 h-96 flex flex-wrap">{squares}</div>;
}

function renderSquare(
  i: number,
  knightPosition: XY,
  moveKnight?: (x: number, y: number) => void
) {
  const x = i % 8;
  const y = Math.floor(i / 8);
  return (
    <div key={i} className="w-[12.5%] h-[12.5%]">
      <BoardSquare
        coord={[x, y]}
        knightPosition={knightPosition}
        onDrop={moveKnight}
      >
        {renderPiece(x, y, knightPosition)}
      </BoardSquare>
    </div>
  );
}

function renderPiece(x: number, y: number, [knightX, knightY]: XY) {
  if (x === knightX && y === knightY) {
    return <Knight />;
  }
}
