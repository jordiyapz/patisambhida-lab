import PaliEditor from "./PaliEditor";
import PaliDictionary from "./PaliDictionary";

function PaliTranslation() {
  return (
    <div className="grid grid-cols-12 gap-2">
      <PaliEditor className="col-span-7" />
      <PaliDictionary className="col-span-5" />
    </div>
  );
}
export default PaliTranslation;
