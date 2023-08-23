import { ChatInputCommandInteraction, Guild, GuildMember } from "discord.js";

export interface GuildCommand extends ChatInputCommandInteraction {
  guild: Guild;
  member: GuildMember;
}
