import { SlashCommandBuilder } from "discord.js";
import rand from "random";

import { Bubbles } from "../config/Bubbles";
import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";
import { getRandomValue } from "../utils/getRandomValue";

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
      const randomGenerator = rand.uniformInt(5, 15);
      const rows = randomGenerator();
      const columns = randomGenerator();
      const bubbleWrap = Array.from({ length: rows }, () =>
        Array.from(
          { length: columns },
          () => `||${getRandomValue(Bubbles)}||`
        ).join(" ")
      ).join("\n");
      await interaction.editReply({
        content: `Please enjoy this sheet of bubble wrap.\n${bubbleWrap}`
      });
    } catch (err) {
      await errorHandler(bot, "bubbles command", err);
    }
  }
};
