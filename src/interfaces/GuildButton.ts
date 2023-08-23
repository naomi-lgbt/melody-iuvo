import { ButtonInteraction, Guild, GuildMember } from "discord.js";

export interface GuildButton extends ButtonInteraction {
  guild: Guild;
  member: GuildMember;
}
