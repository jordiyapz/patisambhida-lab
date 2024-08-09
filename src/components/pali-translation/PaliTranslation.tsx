import { useState } from "react";
import PaliEditor from "./PaliEditor";
import PaliDictionary from "./PaliDictionary";

type Props = {};
function PaliTranslation({}: Props) {
  const [searchTarget, setSearchTarget] = useState("");

  return (
    <div className="grid grid-cols-12 gap-2">
      <PaliEditor className="col-span-7" onSearch={setSearchTarget} />
      <PaliDictionary key={searchTarget}
        className="col-span-5"
        search={searchTarget}
        onSearchChange={(text) => setSearchTarget(text)}
      />
    </div>
  );
}
export default PaliTranslation;
