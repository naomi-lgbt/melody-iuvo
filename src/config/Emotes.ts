import { ModerationAction } from "./ModerationCommands";

export const ActionToEmote: { [key in ModerationAction]: string } = {
  kick: "<:kick:1221180166550716467>",
  ban: "<:ban:1221198878779637800>",
  mute: "<:mute:1221180170526920866>",
  warn: "<:warn:1221181144243109968>",
  unmute: "<:unmute:1221180167507148841>"
};

export const EventToEmote = {
  messageEdit: "<:messageedit:1221188965667700747>",
  messageDelete: "<:messagedelete:1221188967366660096",
  voiceJoin: "<:vcjoin:1221188943677096036>",
  voiceLeave: "<:vcleave:1221188942389575910>",
  voiceMute: "<:mute:1221180170526920866>",
  voiceUnmute: "<:unmute:1221180167507148841>",
  memberUpdate: "<:memberupdate:1221188936467218473>",
  memberJoin: "<:memberadd:1221188941214908416>",
  memberLeave: "<:memberleave:1221188939763810386>",
  threadCreate: "<:threadcreate:1221188937679376384>",
  threadUpdate: "<:threadupdate:1221188935208927402>",
  threadDelete: "<:threaddelete:1221188938925084803>",
  unban: "<:unban:1221180165158207589>"
};
