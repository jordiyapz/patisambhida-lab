import { capitalize } from "@/lib/utils";
import cittaCollection from "./assets/citta.json";

type Props = {};
function CittaList({}: Props) {
  return (
    <div className="bg-slate-700 max-w-full">
      <p className="font-bold pt-3 px-2">Citta list</p>
      <ul className="max-h-[85vh] overflow-auto">
        {cittaCollection.map((citta) => (
          <li key={citta.id} className="px-2 py-2 hover:bg-slate-500">
            <p className="font-semibold">{citta.id}</p>
            <p className="text-sm max-w-full text-nowrap overflow-clip text-ellipsis">
              {capitalize(citta.label.replaceAll("|", ""))}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default CittaList;
