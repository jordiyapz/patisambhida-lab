import { capitalize } from "@/lib/utils";
import cittaCollection from "./assets/citta.json";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {};
function CittaList({}: Props) {
  return (
    <div className="bg-slate-800 max-w-full">
      <p className="font-bold pt-3 px-2">Citta list</p>
      <ul className="max-h-[85vh] max-w-full overflow-auto">
        {cittaCollection.map((citta) => (
          <li
            key={citta.id}
            className="px-2 flex gap-2 items-center hover:bg-slate-700 max-w-full flex-nowrap"
          >
            <Checkbox id={citta.id} />
            <label className="py-2 flex-grow" htmlFor={citta.id}>
              <p className="font-semibold">{citta.id}</p>
              <p className="text-sm text-nowrap overflow-clip text-ellipsis">
                {capitalize(citta.label.replaceAll("|", ""))}
              </p>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default CittaList;
