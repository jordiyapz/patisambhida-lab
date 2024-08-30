import clsx from "clsx";

type Props = { size?: "default" | "sm" };
function Loader({ size = "default" }: Props) {
  return (
    <div className="flex flex-row gap-1">
      <div
        className={clsx(
          "w-2 h-2 rounded-full bg-white animate-bounce",
          size === "sm" && "w-1 h-1"
        )}
      ></div>
      <div
        className={clsx(
          "w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.3s]",
          size === "sm" && "w-1 h-1"
        )}
      ></div>
      <div
        className={clsx(
          "w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.5s]",
          size === "sm" && "w-1 h-1"
        )}
      ></div>
    </div>
  );
}
export default Loader;
