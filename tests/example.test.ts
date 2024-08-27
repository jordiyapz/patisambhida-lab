import { expect, test } from "vitest";
import { windowPeek } from "@/modules/pali-translation/lib/utils";

const adaptInput = (str: string) => str.split("");

const testList: Array<[string, string, Array<number | null>]> = [
  ["ABC", "ABC", [0, 1, 2]],
  ["XABC", "ABC", [null, 0, 1, 2]],
  ["ABCX", "ABC", [0, 1, 2, null]],
  ["BC", "ABC", [1, 2]],
  ["AB", "ABC", [0, 1]],
  ["AC", "ABC", [0, 2]],
  ["ABDFAG", "CDE", [null, null, 1, null, null, null]],
  // TODO: this should pass also
  // ["ABDFAG", "ABCDEFG", [0, 1, 3, 5, null, 6]],
];

test.each(testList)("windowPeek(%s, %s)", (target, current, result) => {
  const computed = windowPeek(adaptInput(current), adaptInput(target), {
    debug: false,
  });
  expect(computed).toHaveLength(target.length);
  expect(computed).toEqual(result);
});
