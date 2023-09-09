export enum ResponseIds {
  erin = "478752726612967435",
  naomi = "465650873650118659",
  naomiAlt = "710195136700874893",
  partnerRole = "cutie",
  default = "default",
}

export const Responses: {
  [type: string]: {
    [userId: string]: string;
  };
} = {
  _template: {
    // erin
    [ResponseIds.erin]: "",
    // naomi
    [ResponseIds.naomi]: "",
    // naomi alt
    [ResponseIds.naomiAlt]: "",
    // partners
    [ResponseIds.partnerRole]: "",
    // default
    [ResponseIds.default]: "",
  },
  melodyPing: {
    [ResponseIds.erin]: "Good day, my Queen. What might you require?",
    [ResponseIds.naomi]: "Hello, Mistress. Might I be of assistance?",
    [ResponseIds.naomiAlt]: "Hello, Mistress. Might I be of assistance?",
    [ResponseIds.partnerRole]: "Hello, dear. What can I do for you today?",
    [ResponseIds.default]: "Yes? How may I be of service to you?",
  },
  outfit: {
    [ResponseIds.erin]:
      "Do you wish to help pick an outfit for Naomi? How is this one?",
    [ResponseIds.naomi]: "Mistress, I chose this outfit for your next event.",
    [ResponseIds.naomiAlt]:
      "Mistress, I chose this outfit for your next event.",
    [ResponseIds.partnerRole]:
      "Looking through your beloved's wardrobe? Did you have a specific outfit in mind?",
    [ResponseIds.default]: "",
  },
  naughty: {
    [ResponseIds.erin]:
      "<@!478752726612967435> my Queen, please do not make me call out your naughty behaviour again.",
    [ResponseIds.naomi]:
      "Mistress, you run this community, and you cannot follow the rules?",
    [ResponseIds.naomiAlt]:
      "Mistress, you run this community, and you cannot follow the rules?",
    [ResponseIds.partnerRole]:
      "{userping}, dating Naomi does not exempt you from the rules...",
    [ResponseIds.default]:
      "Oh dear, it would seem that {userping} has been naughty.",
  },
  greeting: {
    [ResponseIds.erin]:
      "Good morning my Queen. Naomi will be excited to see you today.",
    [ResponseIds.naomi]: "Welcome back Mistress. Did you sleep well?",
    [ResponseIds.naomiAlt]: "Welcome back Mistress. Did you sleep well?",
    [ResponseIds.partnerRole]:
      "Hello there cutie! It is very good to see you again.",
    [ResponseIds.default]: "Good morning! How are you today?",
  },
  goodbye: {
    [ResponseIds.erin]:
      "May you rest well. Dream of Naomi as she dreams of you.",
    [ResponseIds.naomi]: "Sleep well, Mistress. I shall be here when you wake.",
    [ResponseIds.naomiAlt]:
      "Sleep well, Mistress. I shall be here when you wake.",
    [ResponseIds.partnerRole]:
      "Good night cutie. I am sure my Mistress will miss you.",
    [ResponseIds.default]: "Good night! We shall see you tomorrow.",
  },
  thanks: {
    // erin
    [ResponseIds.erin]:
      "{username}, my Queen, you already do so much, and yet you continue to do more.",
    // naomi
    [ResponseIds.naomi]:
      "Mistress, are you certain you are not pushing yourself too hard?",
    // naomi alt
    [ResponseIds.naomiAlt]:
      "Mistress, are you certain you are not pushing yourself too hard?",
    // partners
    [ResponseIds.partnerRole]:
      "{username}, we are so grateful to have a cutie like you in our community.",
    [ResponseIds.default]: "{username}, I appreciate your help in this matter.",
  },
  sorry: {
    // erin
    [ResponseIds.erin]:
      "There is nothing you could ever do that would require an apology, my Queen.",
    // naomi
    [ResponseIds.naomi]: "Mistress, I am sure your community forgives you.",
    // naomi alt
    [ResponseIds.naomiAlt]: "Mistress, I am sure your community forgives you.",
    // partners
    [ResponseIds.partnerRole]:
      "Aww cutie, that's kind of you to apologise. But truly not necessary.",
    [ResponseIds.default]: "It's okay, {username}. We all have our moments.",
  },
};
