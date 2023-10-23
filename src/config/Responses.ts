type responseEvent =
  | "_template"
  | "melodyPing"
  | "greeting"
  | "goodbye"
  | "naughty"
  | "outfit"
  | "thanks"
  | "sorry";

export enum ResponseIds {
  erin = "478752726612967435",
  naomi = "465650873650118659",
  partnerRole = "cutie",
  default = "default"
}

export const Responses: {
  [type in responseEvent]: {
    [userId in ResponseIds]: string[];
  };
} = {
  _template: {
    [ResponseIds.erin]: [""],
    [ResponseIds.naomi]: [""],
    [ResponseIds.partnerRole]: [""],
    [ResponseIds.default]: [""]
  },
  melodyPing: {
    [ResponseIds.erin]: ["Good day, my Queen. What might you require?"],
    [ResponseIds.naomi]: ["Hello, Mama. Might I be of assistance?"],
    [ResponseIds.partnerRole]: ["Hello, dear. What can I do for you today?"],
    [ResponseIds.default]: ["Yes? How may I be of service to you?"]
  },
  outfit: {
    [ResponseIds.erin]: [
      "Do you wish to help pick an outfit for Naomi? How is this one?"
    ],
    [ResponseIds.naomi]: ["Mama, I chose this outfit for your next event."],
    [ResponseIds.partnerRole]: [
      "Looking through your beloved's wardrobe? Did you have a specific outfit in mind?"
    ],
    [ResponseIds.default]: [""]
  },
  naughty: {
    [ResponseIds.erin]: [
      "<@!478752726612967435> my Queen, please do not make me call out your naughty behaviour again."
    ],
    [ResponseIds.naomi]: [
      "Mama, you run this community, and you cannot follow the rules?"
    ],
    [ResponseIds.partnerRole]: [
      "{userping}, dating Naomi does not exempt you from the rules..."
    ],
    [ResponseIds.default]: [
      "Oh dear, it would seem that {userping} has been naughty."
    ]
  },
  greeting: {
    [ResponseIds.erin]: [
      "Good morning my Queen. Naomi will be excited to see you today."
    ],
    [ResponseIds.naomi]: ["Welcome back Mama. Did you sleep well?"],
    [ResponseIds.partnerRole]: [
      "Hello there cutie! It is very good to see you again."
    ],
    [ResponseIds.default]: ["Good morning! How are you today?"]
  },
  goodbye: {
    [ResponseIds.erin]: [
      "May you rest well. Dream of Naomi as she dreams of you."
    ],
    [ResponseIds.naomi]: ["Sleep well, Mama. I shall be here when you wake."],
    [ResponseIds.partnerRole]: [
      "Good night cutie. I am sure Mama will miss you."
    ],
    [ResponseIds.default]: ["Good night! We shall see you tomorrow."]
  },
  thanks: {
    [ResponseIds.erin]: [
      "{username}, my Queen, you already do so much, and yet you continue to do more."
    ],
    [ResponseIds.naomi]: [
      "Mama, are you certain you are not pushing yourself too hard?"
    ],
    [ResponseIds.partnerRole]: [
      "{username}, we are so grateful to have a cutie like you in our community."
    ],
    [ResponseIds.default]: [
      "{username}, I appreciate your help in this matter."
    ]
  },
  sorry: {
    [ResponseIds.erin]: [
      "There is nothing you could ever do that would require an apology, my Queen."
    ],
    [ResponseIds.naomi]: ["Mama, I am sure your community forgives you."],
    [ResponseIds.partnerRole]: [
      "Aww, {username} cutie, that's kind of you to apologise. But truly not necessary."
    ],
    [ResponseIds.default]: ["It's okay, {username}. We all have our moments."]
  }
};
