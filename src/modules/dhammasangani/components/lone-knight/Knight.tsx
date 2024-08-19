import { DragPreviewImage, useDrag } from "react-dnd";
import { ItemTypes, knightImage } from "./constants";
import clsx from "clsx";

export default function Knight() {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: ItemTypes.KNIGHT,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  return (
    <>
      <DragPreviewImage connect={preview} src={knightImage} />
      <div
        ref={drag}
        className={clsx(
          "select-none text-[35px] font-bold cursor-move",
          isDragging && "opacity-50"
        )}
      >
        ♘
      </div>
    </>
  );
}
