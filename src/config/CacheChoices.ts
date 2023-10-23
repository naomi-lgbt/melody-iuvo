import { ExtendedClient } from "../interfaces/ExtendedClient";

export const CacheChoices: {
  name: string;
  value: keyof ExtendedClient["cache"];
}[] = [
  {
    name: "Word Game",
    value: "wordGame"
  },
  {
    name: "Slots",
    value: "slots"
  }
];
