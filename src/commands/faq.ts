import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

import { Faq } from "../config/Faq";
import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";

export const faq: Command = {
  data: new SlashCommandBuilder()
    .setName("faq")
    .setDescription("Get information about this community!")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("What is your question?")
        .setRequired(true)
        .addChoices(...Faq.map((q) => ({ name: q.title, value: q.title })))
    ),
  run: async (Melody, interaction) => {
    try {
      await interaction.deferReply();
      const question = interaction.options.getString("question", true);
      const target = Faq.find((q) => q.title === question);
      if (!target) {
        await interaction.editReply({
          content:
            "I am so sorry, but I do not seem to have that question in my records."
        });
        return;
      }
      const embed = new EmbedBuilder();
      embed.setTitle(target.title);
      embed.setDescription(target.description);
      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      await errorHandler(Melody, "faq command", err);
      await interaction.editReply({
        content:
          "Forgive me, but I failed to complete your request. Please try again later."
      });
    }
  }
};
