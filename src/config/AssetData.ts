import { AssetTarget } from "../interfaces/Asset";

export const ReferenceData: {
  name: string;
  fileName: string;
  description: string;
}[] = [
  {
    name: "Front Body",
    fileName: "front.png",
    description:
      "Naomi has some standard aspects about her appearance that never change. She is slender, with soft pale skin. She's approximately 173cm tall. She keeps her long purple hair up in a pony tail, with her bangs loose.",
  },
  {
    name: "Back Body",
    fileName: "back.png",
    description:
      "Naomi has some standard aspects about her appearance that never change. She is slender, with soft pale skin. She's approximately 173cm tall. She keeps her long purple hair up in a pony tail, with her bangs loose.",
  },
  {
    name: "Face",
    fileName: "face.png",
    description:
      "Naomi's eyes contain miniature galaxies, and she wears purple lipstick, eyeshadow, and blush. She is never seen without her glasses.",
  },
  {
    name: "Hands",
    fileName: "hands.png",
    description:
      "Naomi keeps her fingernails long and filed to a point, and paints them purple.",
  },
  {
    name: "Feet",
    fileName: "feet.png",
    description:
      "Naomi keeps her toes painted a sparkly purple, and never wears socks or shoes.",
  },
];

export const AssetTargets: {
  [key: string]: Partial<AssetTarget>[];
} = {
  adventure: ["naomi", "becca", "rosalia"],
  emote: ["naomi", "becca"],
  portrait: ["naomi", "becca", "rosalia", "beccalia"],
  koikatsu: ["naomi", "becca", "rosalia", "beccalia"],
};
