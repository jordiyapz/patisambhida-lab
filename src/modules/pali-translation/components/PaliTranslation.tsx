import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import PaliEditor from "./PaliEditor";
import PaliDictionary from "./PaliDictionary";
import dpdQueryClient from "../lib/dpd-query-client";

function PaliTranslation() {
  return (
    <div className="grid grid-cols-12 gap-2">
      <PaliEditor className="col-span-7" />
      <QueryClientProvider client={dpdQueryClient}>
        <PaliDictionary className="col-span-5" />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </div>
  );
}
export default PaliTranslation;
