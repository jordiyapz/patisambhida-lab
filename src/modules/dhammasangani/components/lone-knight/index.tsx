import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Board from "./Board";
import { useState } from "react";

function Game() {
  const [knightPosition, setKnightPosition] = useState<[number, number]>([
    4, 5,
  ]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Board
        knightPosition={knightPosition}
        onSquareClick={(x, y) => setKnightPosition([x, y])}
      />
    </DndProvider>
  );
}
export default Game;
