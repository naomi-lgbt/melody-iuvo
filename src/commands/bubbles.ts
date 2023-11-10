import { SlashCommandBuilder } from "discord.js";
import rand from "random";

import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";

export const bubbles: Command = {
  data: new SlashCommandBuilder()
    .setName("bubbles")
    .setDescription(
      "Generate a sheet of bubble wrap to pop. Make sure you don't have spoilers turned off!"
    )
    .setDMPermission(false),
  run: async (bot, interaction) => {
    try {
      await interaction.deferReply();
      const randomGenerator = rand.uniformInt(4, 7);
      const rows = randomGenerator();
      const columns = randomGenerator();
      const bubbleWrap = Array.from({ length: rows }, () =>
        "||<a:bubble:1172567849550745720>||".repeat(columns)
      ).join("\n");
      await interaction.editReply({
        content: `Please enjoy this sheet of bubble wrap.\n${bubbleWrap}`
      });
    } catch (err) {
      await errorHandler(bot, "bubbles command", err);
    }
  }
};
