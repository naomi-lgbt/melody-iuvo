export const FocusRoles = {
  positive: "1170393058244841502",
  comforting: "1170393060203565117",
  studious: "1170393065010241658",
  protective: "1170393067308728500",
  adventurous: "1170393062468485191"
};

export const MagicRoles = {
  light: "1170393160447438959",
  dark: "1170393161508589751"
};

export const PurposeRoles = {
  guardian: "1170393196044501063",
  forager: "1170393198120685630",
  librarian: "1170393200096198656",
  alchemist: "1170393202340147220",
  wanderer: "1170393204785414235"
};

export const FocusChoices: { [key in keyof typeof FocusRoles]: string } = {
  positive: "I wish to be the beacon of hope and light for those around me.",
  comforting:
    "I wish to be the source of comfort and reassurance for those around me.",
  studious:
    "I wish to be the font of knowledge and learning for those around me.",
  protective:
    "I wish to be the wall of safety and protection for those around me.",
  adventurous:
    "I wish to be the pillar of bravery and boldness for those around me."
};

export const MagicChoices: { [key in keyof typeof MagicRoles]: string } = {
  light: "I wish to use my magic to heal and restore my fellow coven members.",
  dark: "I wish to use my magic to protect and defend my fellow coven members."
};

export const PurposeChoices: { [key in keyof typeof PurposeRoles]: string } = {
  guardian: "I wish to spend my time maintaining the safety of the coven.",
  forager:
    "I wish to spend my time finding new resources and materials for the coven.",
  librarian:
    "I wish to spend my time chronicling the knowledge and secrets of the coven.",
  alchemist:
    "I wish to spend my time brewing new potions and spells for the coven.",
  wanderer:
    "I wish to spend my time travelling, bringing new members into the coven."
};
