import { Guild, GuildMember, Message } from "discord.js";

export interface GuildMessage extends Message {
  guild: Guild;
  member: GuildMember;
}
