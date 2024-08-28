import { andOp, prettyPrint } from "./utils";

type RecursiveWindowPeekOptions<Sym> = {
  target: Sym[];
  current: Sym[];

  /** used for determining index of final result. */
  indices?: number[];
  /** window size, default 3 */
  windowSize?: number;
  /** padding options for target, default true */
  shouldPadLeft?: boolean;
  shouldPadRight?: boolean;
  /** render debug */
  debug?: boolean;
};

export function recursiveWindowPeek<Sym>(
  options: RecursiveWindowPeekOptions<Sym>
): Array<number | null> {
  const { target, indices, debug = false } = options;

  let result = Array<number | null>(target.length).fill(null);

  const bag = options.current
    .map((sym, index) => ({
      sym,
      idx: indices ? indices[index] : index,
      used: false,
    }))
    /** STEP: remove unused items from bag */
    .filter((item) => target.includes(item.sym));

  if (!bag.length) return result;

  /** STEP: add padding to target */
  const {
    windowSize = 3,
    shouldPadLeft = true,
    shouldPadRight = true,
  } = options;
  const paddingSize = (windowSize - 1) / 2;
  const padding = Array<null>(paddingSize).fill(null);
  const _target: Array<Sym | null> = [
    ...(shouldPadLeft ? padding : []),
    ...target,
    ...(shouldPadRight ? padding : []),
  ];

  // todo: STEP: pick window
  const middle = Math.floor(bag.length / 2);
  const startIdx = Math.max(middle - paddingSize, 0);
  const endIdx = Math.min(startIdx + windowSize, bag.length);

  const window = bag.slice(startIdx, endIdx);

  // STEP: convolve
  let convoluted: Array<number[]> = [];
  for (let i = 0; i < _target.length - window.length + 1; i++) {
    const mask = window.map((item, j) => Number(item.sym === _target[i + j]));
    convoluted.push(mask);
  }

  debug &&
    prettyPrint(
      convoluted,
      _target,
      window.map((item) => item.sym)
    );

  const rowSum = convoluted.map((row) => row.reduce((a, b) => a + b, 0));
  const maxVal = Math.max(...rowSum);

  // TODO: this could be optimized: do per column, pick the fittest one if a column has 2 values...
  convoluted.forEach((row, rowIdx) => {
    if (rowSum[rowIdx] === maxVal) {
      row.forEach((mask, maskIdx) => {
        if (mask) {
          const bagIndex = startIdx + maskIdx;
          result[rowIdx - paddingSize + maskIdx] = bag[bagIndex].idx;
          bag[bagIndex].used = true;
        }
      });
    }
  });

  debug &&
    console.debug({
      window,
      bag,
      result,
      target,
    });

  // STEP: solve unused bag.
  if (andOp(bag.map((item) => item.used))) {
    // SOLVING LEFT
    const leftTarget = [];
    for (let i = 0; i < result.length; i++) {
      if (result[i] !== null) break;
      leftTarget.push(target[i]);
    }
    const leftBag = bag.slice(0, startIdx);
    debug && console.debug("LEFT-SIDE OF: " + target.join(""));
    const leftResult = recursiveWindowPeek({
      target: leftTarget,
      current: leftBag.map((it) => it.sym),
      indices: leftBag.map((it) => it.idx),
      windowSize,
      debug,
    });
    leftResult.forEach((res, i) => {
      result[i] = res;
    });

    // SOLVING RIGHT
    const rightTarget = [];
    for (let i = result.length - 1; i >= 0; i--) {
      if (result[i] !== null) break;
      rightTarget.unshift(target[i]);
    }
    const rightBag = bag.slice(endIdx);
    debug && console.debug("RIGHT-SIDE OF: " + target.join(""));
    const rightResult = recursiveWindowPeek({
      target: rightTarget,
      current: rightBag.map((it) => it.sym),
      indices: rightBag.map((it) => it.idx),
      windowSize,
      debug,
    });
    rightResult.reverse().forEach((res, i) => {
      result[result.length - i - 1] = res;
    });
  }

  debug && console.debug({ result });

  return result;
}
