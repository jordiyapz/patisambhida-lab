import { describe, expect, test } from "vitest";
import { windowPeek } from "@/modules/pali-translation/lib/utils";
import { recursiveWindowPeek } from "@/modules/pali-translation/lib/recursive-window-peek";

const adaptInput = (str: string) => str.split("");

const testList: Array<[string, string, Array<number | null>, boolean?]> = [
  ["ABC", "ABC", [0, 1, 2]],
  ["XABC", "ABC", [null, 0, 1, 2]],
  ["ABCX", "ABC", [0, 1, 2, null]],
  ["BC", "ABC", [1, 2]],
  ["AB", "ABC", [0, 1]],
  ["AC", "ABC", [0, 2]],
  ["ABDFAG", "CDE", [null, null, 1, null, null, null]],
  ["A", "A", [0]],
  ["B", "A", [null]],
  ["ABDFAG", "ABCDEFG", [0, 1, 3, 5, null, 6]],
  ["GADBCDFGFB", "ABCDEFG", [null, 0, null, 1, 2, 3, 5, 6, null, null]],
];

describe.skip("windowPeek", () => {
  test.each(testList)(
    "windowPeek(%s, %s)",
    (target, current, result, debug = false) => {
      const computed = windowPeek(adaptInput(target), adaptInput(current), {
        debug,
      });
      expect(computed).toHaveLength(target.length);
      expect(computed).toEqual(result);
    }
  );
});

describe("recursiveWindowPeek", () => {
  describe("should pass extensive toy tests", () => {
    test.each(testList)(
      "recursiveWindowPeek(%s, %s)",
      (target, current, result, debug = false) => {
        const computed = recursiveWindowPeek({
          target: adaptInput(target),
          current: adaptInput(current),
          debug,
        });
        expect(computed).toHaveLength(target.length);
        expect(computed).toEqual(result);
      }
    );
  });

  test("should correctly return upon separating comma", () => {
    const origin = [
      '"atītesu',
      "anāgatesu",
      "cāpi,",
      "kappātīto",
      "aticcasuddhipañño,sabbāyatanehi",
      "vippamutto,",
      "sammā",
      "so",
      "loke",
      "paribbajeyya.",
    ];
    const target = [
      '"atītesu',
      "anāgatesu",
      "cāpi,",
      "kappātīto",
      "aticcasuddhipañño,",
      "sabbāyatanehi",
      "vippamutto,",
      "sammā",
      "so",
      "loke",
      "paribbajeyya.",
    ];
    const expectedResult = [0, 1, 2, 3, null, null, 5, 6, 7, 8, 9];

    const result = recursiveWindowPeek({
      target,
      current: origin,
      debug: false,
      debugPretty: false,
    });
    expect(result).toEqual(expectedResult);
  });
});
