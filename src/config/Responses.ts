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
    [ResponseIds.erin]: [
      "Good day, my Queen. What might you require?",
      "My Queen, I am always at your service.",
      "I am ready to serve, my Queen."
    ],
    [ResponseIds.naomi]: [
      "Hello, Mama. Might I be of assistance?",
      "Yes, Mama, what can I do for you?",
      "Mama, I am here to serve!"
    ],
    [ResponseIds.partnerRole]: [
      "Hello, darling. What can I do for you today?",
      "Yes, darling? Did you need me?",
      "Ah, greetings darling. What might I help with?"
    ],
    [ResponseIds.default]: [
      "Yes? How may I be of service to you?",
      "Was there something you needed?",
      "How might I help?"
    ]
  },
  outfit: {
    [ResponseIds.erin]: [
      "Do you wish to help pick an outfit for Naomi? How is this one?",
      "Awww, are you planning for a date night? How adorable!",
      "Does this option meet my Queen's need?"
    ],
    [ResponseIds.naomi]: [
      "Mama, I chose this outfit for your next event.",
      "Here you go Mama. I hope this one is what you had in mind.",
      "I am not sure if this is what you were looking for, but I quite like this one."
    ],
    [ResponseIds.partnerRole]: [
      "Looking through your beloved's wardrobe? Did you have a specific outfit in mind?",
      "Did you want her to wear something specific for you?",
      "Oh-ho, what might you be up to here?"
    ],
    [ResponseIds.default]: [
      "Snooping through Naomi's closet, are we?",
      "You know you can view them all on her website, right?",
      "Here's one of Mama's outfits."
    ]
  },
  naughty: {
    [ResponseIds.erin]: [
      "{userping}, my Queen, please do not make me call out your naughty behaviour again.",
      "You know, {userping}, you may be Naomi's favourite, but we all need to follow the rules.",
      "Perhaps that belongs in Mama's DMs {userping}?"
    ],
    [ResponseIds.naomi]: [
      "{userping}, you run this community, and you cannot follow the rules?",
      "Come now, {userping}, you are supposed to be leading by example here.",
      "Pardon me {userping}, but I'd like to remind you to keep things appropriate."
    ],
    [ResponseIds.partnerRole]: [
      "{userping}, dating Naomi does not exempt you from the rules...",
      "Hold on, {userping}, our community is still family friendly.",
      "Please, {userping}, keep things appropriate here."
    ],
    [ResponseIds.default]: [
      "Oh dear, it would seem that {userping} has been naughty.",
      "My my, {userping} seems to have forgotten our rules.",
      "{userping}, must I remind you about our community standards?"
    ]
  },
  greeting: {
    [ResponseIds.erin]: [
      "Good morning my Queen. Naomi will be excited to see you today.",
      "My Queen, it is so very good to see you again.",
      "I hope you got plenty of rest, my Queen."
    ],
    [ResponseIds.naomi]: [
      "Welcome back Mama. Did you sleep well?",
      "Hello, Mama! Have you got any exciting plans for the day?",
      "It is great to have you back, Mama. The community feels so empty without you."
    ],
    [ResponseIds.partnerRole]: [
      "Hello there darling! It is very good to see you again.",
      "Darling, it is good to see that you have returned.",
      "Welcome back, darling."
    ],
    [ResponseIds.default]: [
      "Good morning! How are you today?",
      "Hello~! We are excited to chat with you today.",
      "It is good to have you back!"
    ]
  },
  goodbye: {
    [ResponseIds.erin]: [
      "May you rest well. Dream of Naomi as she dreams of you.",
      "You shall be missed, my Queen. I wish you sweet dreams.",
      "Good night, my Queen. We will miss you!"
    ],
    [ResponseIds.naomi]: [
      "Sleep well, Mama. I shall be here when you wake.",
      "Sweet dreams, Mama. Things will be quiet here without you.",
      "Take care, Mama. We look forward to your return."
    ],
    [ResponseIds.partnerRole]: [
      "Good night darling. I am sure Mama will miss you.",
      "May your dreams bring you peace tonight, darling.",
      "Darling, will we see you tomorrow?"
    ],
    [ResponseIds.default]: [
      "Good night! We shall see you tomorrow.",
      "Rest well! We will be here!",
      "Take care, now."
    ]
  },
  thanks: {
    [ResponseIds.erin]: [
      "{username}, my Queen, you already do so much, and yet you continue to do more.",
      "I know that there is no gratitude that matches how much Naomi appreciates your love, {username}.",
      "Isn't {username} just wonderful? She does so much for us."
    ],
    [ResponseIds.naomi]: [
      "{username}, are you certain you are not pushing yourself too hard?",
      "Take care that you do not overburden yourself, {username}.",
      "See {username}? Your community does appreciate you."
    ],
    [ResponseIds.partnerRole]: [
      "{username}, we are so grateful to have a darling like you in our community.",
      "It would seem you are doing quite well for us, {username}.",
      "Thank you, {username}, for your efforts in our community."
    ],
    [ResponseIds.default]: [
      "{username}, I appreciate your help in this matter.",
      "We hope that you get as much value from our community as you bring, {username}",
      "We are indeed grateful for what {username} does for us."
    ]
  },
  sorry: {
    [ResponseIds.erin]: [
      "There is nothing you could ever do that would require an apology, my Queen.",
      "My Queen, you know that you can do no wrong, yes?",
      "Nothing, my Queen, will ever shake Naomi's love for you."
    ],
    [ResponseIds.naomi]: [
      "Mama, I am sure your community forgives you.",
      "Come now, Mama, you are being far too hard on yourself.",
      "I am sure it is not the end of the world, Mama. You can fix it."
    ],
    [ResponseIds.partnerRole]: [
      "Aww, {username}, that's kind of you to apologise. But truly not necessary.",
      "{username}, your apology is more than accepted.",
      "Now now, no need to beat yourself up {username}."
    ],
    [ResponseIds.default]: [
      "It's okay, {username}. We all have our moments.",
      "Thank you for recognising your errors, {username}",
      "{username} don't worry, I am sure it will be okay."
    ]
  }
};
