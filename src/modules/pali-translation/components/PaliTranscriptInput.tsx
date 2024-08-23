import { Textarea } from "@/components/ui/textarea";
import { usePaliStore } from "../lib/pali-store";
import { forwardRef, type HTMLProps } from "react";

type Props = HTMLProps<HTMLTextAreaElement>;

const PaliTranscriptInput = forwardRef<HTMLTextAreaElement, Props>(
  (props, ref) => {
    return (
      <Textarea
        ref={ref}
        id="pali-editor"
        className="flex-grow text-md leading-[4rem]"
        placeholder="Write pali script here..."
        rows={8}
        {...props}
      />
    );
  }
);

export default PaliTranscriptInput;
