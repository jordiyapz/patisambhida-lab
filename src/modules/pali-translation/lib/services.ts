export const fetchDPDict = async (search: string) => {
  const url = `https://corsmirror.onrender.com/v1/cors?url=${encodeURIComponent(
    `https://www.dpdict.net/gd?search=${encodeURI(search)}`
  )}`;
  const dom = await fetch(url).then((res) => res.text());
  return dom;
};
