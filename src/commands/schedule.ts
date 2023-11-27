import { AttachmentBuilder, SlashCommandBuilder } from "discord.js";

import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";

export const schedule: Command = {
  data: new SlashCommandBuilder()
    .setName("schedule")
    .setDescription("Get Naomi's stream schedule~!")
    .setDMPermission(false),
  run: async (bot, interaction) => {
    try {
      await interaction.deferReply();
      const raw = await fetch("https://cdn.nhcarrigan.com/schedule.png");
      const arrayBuffer = await raw.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const attachment = new AttachmentBuilder(buffer, {
        name: "schedule.png"
      });
      await interaction.editReply({
        files: [attachment]
      });
    } catch (err) {
      await errorHandler(bot, "yokai command", err);
      await interaction.editReply({
        content:
          "Forgive me, but I failed to complete your request. Please try again later."
      });
    }
  }
};
