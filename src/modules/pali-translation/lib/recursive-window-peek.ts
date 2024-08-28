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
  debugPretty?: boolean;
};

export function recursiveWindowPeek<Sym>(
  options: RecursiveWindowPeekOptions<Sym>
): Array<number | null> {
  const { target, indices, debug = false } = options;
  const debugPretty = options.debugPretty ?? debug;

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

  debugPretty &&
    prettyPrint(
      convoluted,
      _target,
      window.map((item) => item.sym)
    );

  const rowSum = convoluted.map((row) => row.reduce((a, b) => a + b, 0));

  for (let i = 0; i < window.length; i++) {
    const item = window[i];
    let max: number = 0;
    let maxIdx: number = -1;
    for (let row = 0; row < convoluted.length; row++) {
      // find the max score for this item.
      if (convoluted[row][i]) {
        const sum = rowSum[row];
        if (max < sum) {
          max = sum;
          maxIdx = row;
        }
      }
    }
    debug && console.debug({ sym: item.sym, maxIdx });
    if (maxIdx > -1) {
      item.used = true;
      result[maxIdx - paddingSize + i] = item.idx;
    }
  }

  debug &&
    console.debug({
      target,
      window,
      bag,
      result,
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
    debug && console.debug("LEFT-SIDE OF: " + target.join("; "));
    const leftResult = recursiveWindowPeek({
      target: leftTarget,
      current: leftBag.map((it) => it.sym),
      indices: leftBag.map((it) => it.idx),
      windowSize,
      debug,
      debugPretty,
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
    debug && console.debug("RIGHT-SIDE OF: " + target.join("; "));
    const rightResult = recursiveWindowPeek({
      target: rightTarget,
      current: rightBag.map((it) => it.sym),
      indices: rightBag.map((it) => it.idx),
      windowSize,
      debug,
      debugPretty,
    });
    rightResult.reverse().forEach((res, i) => {
      result[result.length - i - 1] = res;
    });
    debug && console.debug({ combinedResult: result });
  }

  return result;
}
