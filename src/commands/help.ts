import { SlashCommandBuilder } from "discord.js";

import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";

export const help: Command = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("What does Melody do?")
    .setDMPermission(false),
  run: async (Melody, interaction) => {
    try {
      await interaction.deferReply();
      await interaction.editReply({
        content:
          "Greetings! I am Melody Iuvo, Naomi's personal assistant. My role here is to provide access to information you might need when finding your way around our community. Use my `/faq` command if you have a question!\n\nI want to ensure you have fun while you are here, so I also manage a few other facets of our group."
      });
    } catch (err) {
      await errorHandler(Melody, "help command", err);
      await interaction.editReply({
        content:
          "Forgive me, but I failed to complete your request. Please try again later."
      });
    }
  }
};
