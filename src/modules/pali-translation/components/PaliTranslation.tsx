import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import PaliEditor from "./PaliEditor";
import PaliDictionary from "./PaliDictionary";
import queryClient from "../lib/query-client";

function PaliTranslation() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="grid grid-cols-12 gap-2">
        <PaliEditor className="col-span-7" />
        <PaliDictionary className="col-span-5" />
      </div>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
export default PaliTranslation;
