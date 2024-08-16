import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Token {
  word: string;
  type: "noun" | "verb";
}

interface NounToken extends Token {
  type: "noun";
  gender: "masc" | "nt" | "fem";
}

export type PaliStore = {
  transcript: string;
  search: string;
  tokens: Token[];

  setTranscript: (transcript: string) => void;
  setSearch: (text: string) => void;
};

export const usePaliStore = create<PaliStore>()(
  persist(
    (set, get) => ({
      transcript: "",
      search: "",
      tokens: [],
      setTranscript: (transcript) => set((state) => ({ ...state, transcript })),
      setSearch: (text: string) => set((state) => ({ ...state, search: text })),
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
