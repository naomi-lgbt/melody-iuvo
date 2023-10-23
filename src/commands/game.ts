import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

import { Command } from "../interfaces/Command";
import { SteamGameResponse } from "../interfaces/Steam";
import { errorHandler } from "../utils/errorHandler";
import { getRandomValue } from "../utils/getRandomValue";

export const game: Command = {
  data: new SlashCommandBuilder()
    .setName("game")
    .setDescription("Get a random game from Naomi's Steam library."),
  run: async (bot, interaction) => {
    try {
      await interaction.deferReply();
      if (!bot.games || !bot.games.length || !process.env.STEAM_KEY) {
        await interaction.editReply({
          content:
            "Steam has not been properly configured. I am unable to recommend games at this time."
        });
        return;
      }
      const target = getRandomValue(bot.games);
      const raw = await fetch(
        `https://store.steampowered.com/api/appdetails?appids=${target.appid}&key=${process.env.STEAM_KEY}`
      );
      const json = (await raw.json()) as SteamGameResponse;
      const data = json[target.appid].data;
      if (!data) {
        await interaction.editReply({
          content: `There was an error loading game data for ${target.appid}. Please try again later.`
        });
        return;
      }
      const embed = new EmbedBuilder();
      embed.setTitle(data.name);
      embed.setDescription(data.short_description);
      embed.setURL(data.website);
      embed.setImage(data.header_image);
      await interaction.editReply({
        content:
          "[View Naomi's full library](<https://steamcommunity.com/id/naomi-lgbt/games/?tab=all&sort=name>)",
        embeds: [embed]
      });
    } catch (err) {
      await errorHandler(bot, "game command", err);
      await interaction.editReply({
        content:
          "Forgive me, but I failed to complete your request. Please try again later."
      });
    }
  }
};
