export function velthuisToUni(velthiusInput: string): string {
  if (!velthiusInput) return velthiusInput;

  const nigahita = "ṃ";
  const capitalNigahita = "Ṃ";

  const uni = velthiusInput
    .replace(/aa/g, "ā")
    .replace(/ii/g, "ī")
    .replace(/uu/g, "ū")
    .replace(/\.t/g, "ṭ")
    .replace(/\.d/g, "ḍ")
    .replace(/"n/g, "ṅ") // double quote
    .replace(/\u201Dn/g, "ṅ") // \u201D = Right Double Quotation Mark
    .replace(/“n/g, "ṅ") // apple curly quote
    .replace(/”n/g, "ṅ") // apple curly quote
    .replace(/;n/g, "ṅ") // easier vel ṅ
    .replace(/~n/g, "ñ")
    .replace(/;y/g, "ñ") // easier vel ñ
    .replace(/\.n/g, "ṇ")
    .replace(/\.m/g, nigahita)
    .replace(/\u1E41/g, nigahita) // ṁ
    .replace(/\.l/g, "ḷ")
    .replace(/AA/g, "Ā")
    .replace(/II/g, "Ī")
    .replace(/UU/g, "Ū")
    .replace(/\.T/g, "Ṭ")
    .replace(/\.D/g, "Ḍ")
    .replace(/"N/g, "Ṅ")
    .replace(/\u201DN/g, "Ṅ")
    .replace(/~N/g, "Ñ")
    .replace(/\.N/g, "Ṇ")
    .replace(/\.M/g, capitalNigahita)
    .replace(/\u1E40/g, capitalNigahita) // Ṁ
    .replace(/\.L/g, "Ḷ")
    .replace(/\.ll/g, "ḹ")
    .replace(/\.r/g, "ṛ")
    .replace(/\.rr/g, "ṝ")
    .replace(/\.s/g, "ṣ")
    // .replace(/"s/g, "ś")
    .replace(/\u201Ds/g, "ś")
    .replace(/\.h/g, "ḥ");

  return uni;
}

export function removePunctuation(str: string): string {
  return str.replaceAll(/[\u104a\u104b\u2018\u2019",\.\?]/g, "");
}

export const jsonHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export interface Token {
  symbol: string;
  case: string;
  meaning: string;
}

export interface Line {
  tokens: Token[];
  summary: string;
}

export function initializeLines(transcript: string) {
  return transcript.split("\n").map<Line>((x) => ({
    tokens: x
      .split(" ")
      .filter((s) => !!s)
      .map<Token>((symbol) => ({
        symbol,
        case: "",
        meaning: "",
      })),
    summary: "",
  }));
}

export function indexOfMax(arr: number[]) {
  if (arr.length === 0) {
    return -1;
  }

  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }

  return maxIndex;
}

type WindowPeekOptions = Partial<{ windowSize: number; debug: boolean }>;

/** for windowPeek */
export function prettyPrint<T>(res: number[][], _curr: Array<T | null>) {
  console.log(_curr.map((x) => (x === null ? "X" : x)).join(""));
  res.forEach((row, i) => {
    console.log([...Array(i).fill("_"), ...row].join(""));
  });
}

export function windowPeek<T>(
  current: T[],
  target: T[],
  options: WindowPeekOptions = {}
): Array<number | null> {
  let result = Array<number | null>(target.length).fill(null);

  const { windowSize = 3, debug = false } = options;
  const padding = (windowSize - 1) / 2;

  // add padding
  const pad = Array<null>(padding).fill(null);
  const _target: Array<T | null> = [...pad, ...target, ...pad];

  // todo: remove unused target
  const _curr = current;
  // const _curr = current
  //   .map((sym) => {
  //     if (target.includes(sym)) return sym;
  //     return null;
  //   })
  //   .filter((c) => c !== null);

  // todo: pick window
  const window = [..._curr];

  debug && console.debug({ _target, _curr, window });

  // convolve
  let res: Array<number[]> = [];
  for (let i = 0; i < _target.length + 1 - windowSize; i++) {
    const mapped = window.map((t, j) => {
      return Number(t === _target[i + j]);
    });
    res.push(mapped);
  }

  debug && prettyPrint(res, _target);

  const rowSum = res.map((row) => row.reduce((a, b) => a + b, 0));
  const maxVal = Math.max(...rowSum);

  res.forEach((row, r) => {
    if (rowSum[r] === maxVal) {
      row.forEach((mask, i) => {
        if (mask) {
          result[r + i - 1] = i;
        }
      });
    }
  });

  return result;
}
