import { SlashCommandBuilder } from "discord.js";

import { ExtendedClient } from "./ExtendedClient";
import { GuildCommand } from "./GuildCommand";

export interface Command {
  data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  run: (bot: ExtendedClient, interaction: GuildCommand) => Promise<void>;
}
