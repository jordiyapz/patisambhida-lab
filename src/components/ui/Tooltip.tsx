import clsx from "clsx";

type Props = { title: string; pos?: "top" | "bottom" };
function Tooltip({ title, pos = "top" }: Props) {
  return (
    <div className="hidden group-hover:block">
      <div
        className={clsx(
          "group absolute left-1/2 z-50 flex -translate-x-1/2 flex-col items-center rounded-sm text-center text-sm text-slate-300",
          pos === "top" ? "-top-12 before:-top-2" : "-bottom-12 before:-bottom-2"
        )}
      >
        {pos === "bottom" && (
          <div className="h-0 w-fit border-l-8 border-r-8 border-transparent border-b-8 border-b-slate-800" />
        )}
        <div className="rounded-sm bg-slate-800 py-1 px-2">
          <p className="whitespace-nowrap">{title}</p>
        </div>
        {pos === "top" && (
          <div className="h-0 w-fit border-l-8 border-r-8 border-transparent border-t-8 border-t-slate-800" />
        )}
      </div>
    </div>
  );
}
export default Tooltip;
