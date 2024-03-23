import { ModerationAction } from "./ModerationCommands";

export const ActionToEmote: { [key in ModerationAction]: string } = {
  kick: "<:kick:1221180166550716467>",
  ban: "<:ban:1221180169352515644>",
  mute: "<:mute:1221180170526920866>",
  warn: "<:warn:1221181144243109968>",
  unmute: "<:unmute:1221180167507148841>"
};
