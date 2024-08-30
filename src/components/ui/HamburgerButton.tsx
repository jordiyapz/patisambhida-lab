import { Button } from "./button";

function HamburgerButton() {
  return (
    <Button className="h-auto rounded px-2 py-1 flex-col gap-1 hidden group-hover:flex bg-slate-900 ">
      <div className="h-[2px] w-3 rounded-full bg-white" />
      <div className="h-[2px] w-3 rounded-full bg-white" />
      <div className="h-[2px] w-3 rounded-full bg-white" />
    </Button>
  );
}
export default HamburgerButton;
