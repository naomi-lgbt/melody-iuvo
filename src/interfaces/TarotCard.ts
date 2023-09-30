export interface TarotCard {
  name: string;
  type: "major" | "minor";
  value: number;
  meaning: string;
  reversed: string;
}
