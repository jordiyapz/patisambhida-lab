import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Token {
  row: number;
  index: number;
  word: string;
  case: string;
  meaning: string;
}

export type PaliStore = {
  transcript: string;
  search: string;
  tokens: Token[];
  sentences: string[];

  setTranscript: (transcript: string) => void;
  setSearch: (text: string) => void;
  setTokenCase: (args: { row: number; index: number; value: string }) => void;
  setTokenMeaning: (args: {
    row: number;
    index: number;
    value: string;
  }) => void;
  setSentence: (index: number, value: string) => void;
};

export const usePaliStore = create<PaliStore>()(
  persist(
    (set, get) => ({
      transcript: "",
      search: "",
      tokens: [],
      sentences: [],
      setTranscript(transcript) {
        const lines = transcript.split("\n").map((line) => line.split(" "));
        const tokens = lines
          .map((line, row) => {
            return line.map((word, i) => ({
              row,
              index: i,
              word,
              case: "",
              meaning: "",
            }));
          })
          .reduce((acc, line) => [...acc, ...line], [] satisfies Token[]);
        return set((state) => ({
          ...state,
          transcript,
          tokens,
        }));
      },
      setSearch: (text: string) => set((state) => ({ ...state, search: text })),
      setTokenCase: ({ index, row, value }) =>
        set((state) => {
          const tokenIndex = state.tokens.findIndex(
            (t) => t.row === row && t.index === index
          );
          if (tokenIndex == -1) {
            console.table(state.tokens);
            console.debug({ index, row });
            return state;
          }

          const newToken: Token = { ...state.tokens[tokenIndex], case: value };
          const newTokenList = [
            ...state.tokens.slice(0, tokenIndex),
            newToken,
            ...state.tokens.slice(tokenIndex + 1),
          ];
          return { ...state, tokens: newTokenList };
        }),
      setTokenMeaning: ({ index, row, value }) =>
        set((state) => {
          const tokenIndex = state.tokens.findIndex(
            (t) => t.row === row && t.index === index
          );
          if (tokenIndex == -1) {
            console.table(state.tokens);
            console.debug({ index, row });
            return state;
          }

          const newToken: Token = {
            ...state.tokens[tokenIndex],
            meaning: value,
          };
          const newTokenList = [
            ...state.tokens.slice(0, tokenIndex),
            newToken,
            ...state.tokens.slice(tokenIndex + 1),
          ];
          return { ...state, tokens: newTokenList };
        }),
      setSentence: (i, value) =>
        set((s) => ({
          ...s,
          sentences: [
            ...s.sentences.slice(0, i),
            value,
            ...s.sentences.slice(i + 1),
          ],
        })),
    }),
    {
      name: "pali-storage", // name of the item in the storage (must be unique)
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !["search"].includes(key))
        ),
    }
  )
);
