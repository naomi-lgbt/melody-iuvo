import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder
} from "discord.js";

import { ExtendedClient } from "./ExtendedClient";
import { GuildCommand } from "./GuildCommand";

export interface Command {
  data:
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    | SlashCommandSubcommandsOnlyBuilder;
  run: (Melody: ExtendedClient, interaction: GuildCommand) => Promise<void>;
}
