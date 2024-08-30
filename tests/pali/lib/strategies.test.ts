import {
  recursiveWindowStrategy,
  setNullStrategy,
} from "@/modules/pali-translation/lib/strategies";
import { initializeLines } from "@/modules/pali-translation/lib/utils";
import { describe, expect, test } from "vitest";

describe("Set null strategy", () => {
  test("should return null", () => {
    const res = setNullStrategy(
      "In Lorem enim velit deserunt officia veniam tempor reprehenderit irure fugiat.",
      []
    );
    expect(res).toBeNull();
  });
});

describe("Recursive window strategy", () => {
  test("should not change if nothing changes", () => {
    const transcript =
      "In Lorem enim velit, deserunt officia veniam. tempor reprehenderit irure fugiat.";
    const lines = initializeLines(transcript);
    const transformed = recursiveWindowStrategy(transcript, lines);
    expect(transformed).toEqual(lines);
  });
  test("should change", () => {
    const originalTranscript =
      "In Lorem enim velit, deserunt officia veniam. tempor reprehenderit irure fugiat.";
    const newTranscript =
      "In Lorem enim velit, officia veniam. tempor reprehenderit irure fugiat.";

    const originalLines = initializeLines(originalTranscript);
    const newLines = initializeLines(newTranscript);
    const transformed = recursiveWindowStrategy(newTranscript, originalLines);
    expect(transformed).toEqual(newLines);
  });
  // TODO: should handle multiple lines
  test.todo("should handle multiple lines", () => {
    const originalTranscript = "One two line";
    const newTranscript = "One, two\nNew line!";

    const originalLines = initializeLines(originalTranscript);
    const newLines = initializeLines(newTranscript);
    const transformed = recursiveWindowStrategy(newTranscript, originalLines);
    expect(transformed).toEqual(newLines);
  });
});
