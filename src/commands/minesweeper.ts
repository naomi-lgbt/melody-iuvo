import { SlashCommandBuilder } from "discord.js";
import Minesweeper from "discord.js-minesweeper";
import rand from "random";

import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";

export const minesweeper: Command = {
  data: new SlashCommandBuilder()
    .setName("minesweeper")
    .setDescription("Creates a minesweeper game.")
    .setDMPermission(false),
  run: async (bot, interaction) => {
    try {
      await interaction.deferReply();
      const generator = rand.uniformInt(5, 10);
      const game = new Minesweeper({
        rows: generator(),
        columns: generator(),
        mines: generator(),
        returnType: "emoji"
      }).start();
      if (typeof game !== "string") {
        await interaction.editReply({ content: "Failed to generate board." });
        return;
      }
      await interaction.editReply(
        game.replace(/\s:(\w+):\s/g, ":$1:").replace(/\|\| \|\|/g, "||||")
      );
    } catch (err) {
      await errorHandler(bot, "minesweeper command", err);
    }
  }
};
