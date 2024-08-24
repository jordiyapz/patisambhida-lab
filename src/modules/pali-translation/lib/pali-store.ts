import { create, type StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { initializeLines, type Line } from "./utils";
import { immer } from "zustand/middleware/immer";

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

type XY = [x: number, y: number];

export interface LinesSlice {
  lines: Line[];
  setLines: (line: Line[]) => void;
  initializeLines: (transcript: string) => void;
  setLineSummary: (row: number, value: string) => void;
  setTokenCase: (location: XY, value: string) => void;
  setTokenMeaning: (location: XY, value: string) => void;
}

type ImmerStateCreator<T> = StateCreator<
  T,
  [["zustand/immer", never], never],
  [],
  T
>;

const createLinesSlice: ImmerStateCreator<LinesSlice> = (set) => ({
  lines: [],
  setLines: (lines: Line[]) =>
    set((s) => {
      s.lines = lines;
    }),
  initializeLines: (transcript) =>
    set((s) => {
      s.lines = initializeLines(transcript);
    }),
  setLineSummary: (row, value) =>
    set((s) => {
      s.lines[row].summary = value;
    }),
  setTokenCase: ([row, col], value) =>
    set((s) => {
      s.lines[row].tokens[col].case = value;
    }),
  setTokenMeaning: ([row, col], value) =>
    set((s) => {
      s.lines[row].tokens[col].meaning = value;
    }),
});

interface SearchSlice {
  search: string;
  setSearch: (value: string) => void;
}

const createSearchSlice: ImmerStateCreator<SearchSlice> = (set) => ({
  search: "",
  setSearch: (value: string) =>
    set((s) => {
      s.search = value;
    }),
});

export const useNewPaliStore = create<LinesSlice & SearchSlice>()(
  immer((...a) => ({
    ...createLinesSlice(...a),
    ...createSearchSlice(...a),
  }))
);
