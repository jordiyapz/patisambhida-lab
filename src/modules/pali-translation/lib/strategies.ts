import {
  removePunctuation,
  type Line,
} from "@/modules/pali-translation/lib/utils";
import { recursiveWindowPeek } from "./recursive-window-peek";

export function setNullStrategy(_transcript?: string, _lines?: Line[]) {
  return null;
}

/** Caveat: can only handle single line... 😐 */
export function recursiveWindowStrategy(transcript: string, lines: Line[]) {
  const transcriptWords = transcript.split(" ").filter((s) => !!s);
  const transcriptTokens = transcriptWords
    // remove punctuation
    .map(removePunctuation)
    // remove empty token
    .filter((token) => !!token);

  const linearTokens = lines
    .map((line) => line.tokens)
    // linearization
    .reduce((acc, l) => [...acc, ...l], [])
    .map((token) => removePunctuation(token.symbol));

  const newOrder = recursiveWindowPeek({
    target: transcriptTokens,
    current: linearTokens,
  });

  return [
    {
      ...lines[0],
      tokens: newOrder.map((idx, i) =>
        idx !== null
          ? lines[0].tokens[idx]
          : { symbol: transcriptWords[i], case: "", meaning: "" }
      ),
    },
  ];
}
