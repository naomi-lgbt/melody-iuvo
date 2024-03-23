import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";

import { Command } from "../interfaces/Command";
import { CommandHandler } from "../interfaces/CommandHandler";
import { handleNaomiAsk } from "../modules/subcommands/naomi/handleNaomiAsk";
import { handleNaomiSays } from "../modules/subcommands/naomi/handleNaomiSays";
import { errorHandler } from "../utils/errorHandler";

const handlers: { [key: string]: CommandHandler } = {
  says: handleNaomiSays,
  ask: handleNaomiAsk
};

export const naomi: Command = {
  data: new SlashCommandBuilder()
    .setName("naomi")
    .setDescription("Commands related to Mama Naomi.")
    .setDMPermission(false)
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("says")
        .setDescription("Want Naomi to say something?")
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("What you want Naomi to say.")
            .setRequired(true)
            .setMaxLength(200)
        )
        .addStringOption((option) =>
          option
            .setName("colour")
            .setDescription("The hex string to use for the text.")
            .setMinLength(6)
            .setMaxLength(7)
        )
        .addStringOption((option) =>
          option
            .setName("background")
            .setDescription("The hex string to use for the background.")
            .setMinLength(6)
            .setMaxLength(7)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("ask")
        .setDescription(
          "Ask Mama Naomi an anonymous question. Make sure to follow our community guidelines."
        )
    ),
  run: async (Melody, interaction) => {
    try {
      const subcommand = interaction.options.getSubcommand();
      if (subcommand !== "ask") {
        await interaction.deferReply();
      }
      const handler = handlers[subcommand];
      handler
        ? await handler(Melody, interaction)
        : await interaction.editReply({
            content:
              "I have failed you once again. The command you used does not have an instruction manual for me."
          });
    } catch (err) {
      await errorHandler(Melody, "naomi command", err);
      await interaction.editReply({
        content:
          "Forgive me, but I failed to complete your request. Please try again later."
      });
    }
  }
};
