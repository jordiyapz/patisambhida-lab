interface Dhamma {
  type: "ci" | "ce" | "ru" | "ni";
  name: string;
}
interface Citta extends Dhamma {
  type: "ci";
}
interface Cetasika extends Dhamma {
  type: "ce";
  isKilesa?: boolean;
}

const dhammaData: Citta[] | Cetasika[] = [
  { type: "ce", name: "lobha", isKilesa: true },
  { type: "ce", name: "dosa", isKilesa: true },
  { type: "ce", name: "moha", isKilesa: true },
  { type: "ce", name: "māna", isKilesa: true },
  { type: "ce", name: "diṭṭhi", isKilesa: true },
  { type: "ce", name: "vicikicchā", isKilesa: true },
  { type: "ce", name: "thīna", isKilesa: true },
  { type: "ce", name: "uddhacca", isKilesa: true },
  { type: "ce", name: "ahirika", isKilesa: true },
  { type: "ce", name: "anottappa", isKilesa: true },
];

const associationData = []