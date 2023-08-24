import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";

import { Command } from "../interfaces/Command";
import { CommandHandler } from "../interfaces/CommandHandler";
import { handlePluralCreate } from "../modules/subcommands/plural/handlePluralCreate";
import { handlePluralDelete } from "../modules/subcommands/plural/handlePluralDelete";
import { handlePluralFront } from "../modules/subcommands/plural/handlePluralFront";
import { errorHandler } from "../utils/errorHandler";

const handlers: { [key: string]: CommandHandler } = {
  create: handlePluralCreate,
  delete: handlePluralDelete,
  front: handlePluralFront,
};

export const plural: Command = {
  data: new SlashCommandBuilder()
    .setName("plural")
    .setDescription("Manage your system identities.")
    .setDMPermission(false)
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("create")
        .setDescription("Create a plural identity.")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name of the identity.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("avatar")
            .setDescription("A URL to the image to use as the avatar.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("prefix")
            .setDescription(
              "The prefix to trigger a proxied message from this identity."
            )
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("delete")
        .setDescription("Delete a plural identity.")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name of the identity to delete.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("front")
        .setDescription("Set a plural identity to autoproxy messages.")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription(
              "The name of the identity fronting. Leave blank to disable auto-proxying."
            )
            .setRequired(true)
        )
    ),
  run: async (bot, interaction) => {
    try {
      await interaction.deferReply({ ephemeral: true });
      const subcommand = interaction.options.getSubcommand();
      handlers[subcommand]
        ? await handlers[subcommand](bot, interaction)
        : await interaction.editReply({
            content:
              "I have failed you once again. The command you used does not have an instruction manual for me.",
          });
    } catch (err) {
      await errorHandler(bot, "pluarl command", err);
      await interaction.editReply({
        content:
          "Forgive me, but I failed to complete your request. Please try again later.",
      });
    }
  },
};
