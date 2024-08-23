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
    .replace(/"s/g, "ś")
    .replace(/\u201Ds/g, "ś")
    .replace(/\.h/g, "ḥ");

  return uni;
}

export const jsonHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
};
