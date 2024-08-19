import CittaList from "./CittaList";

type Props = {};

function Grouping({}: Props) {
  return (
    <div className="grid grid-cols-[400px_auto] h-60">
      <CittaList />
      <div>area</div>
    </div>
  );
}
export default Grouping;
