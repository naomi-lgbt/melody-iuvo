import { Guild, GuildMember, GuildTextBasedChannel, Message } from "discord.js";

export interface GuildMessage extends Message {
  guild: Guild;
  member: GuildMember;
  channel: GuildTextBasedChannel;
}
