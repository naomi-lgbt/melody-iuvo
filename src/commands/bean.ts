import { SlashCommandBuilder } from "discord.js";

import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";
import { isOwner } from "../utils/isOwner";

export const bean: Command = {
  data: new SlashCommandBuilder()
    .setName("bean")
    .setDescription("Bean a user.")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user to bean.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Why are you beaning them?")
        .setRequired(true)
    ),
  run: async (bot, interaction) => {
    try {
      await interaction.deferReply({ ephemeral: true });
      if (!isOwner(interaction.user.id)) {
        await interaction.editReply({
          content: "Only Mama Naomi may use this command."
        });
        return;
      }
      const target = interaction.options.getUser("target", true);
      const reason = interaction.options.getString("reason", true);
      bot.beanedUser = target.id;

      await bot.discord.channels.general.send({
        content: `<@!${target.id}> has been beaned!\nWhy?\nWell...\n${reason}`
      });
      await interaction.editReply({
        content: "Done~!"
      });
    } catch (err) {
      await errorHandler(bot, "assets command", err);
      await interaction.editReply({
        content:
          "Forgive me, but I failed to complete your request. Please try again later."
      });
    }
  }
};
