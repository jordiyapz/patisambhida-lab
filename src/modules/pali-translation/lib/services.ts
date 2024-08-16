import { parse } from "node-html-parser";

export const fetchDPDict = async (search: string) => {
  const url = `https://corsmirror.onrender.com/v1/cors?url=${encodeURIComponent(
    `https://www.dpdict.net/gd?search=${encodeURI(search)}`
  )}`;
  const dom = await fetch(url).then((res) =>
    res
      .text()
      .then((text) => parse(text, { blockTextElements: { style: false } }))
  );
  const results = dom.getElementById("dpd-results");
  const grammarDict = dom.querySelector(".grammar_dict");

  return { dom, results, grammarDict };
};
