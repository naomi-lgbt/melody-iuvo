import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { JSDOM } from "jsdom";

import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";

export const yokai: Command = {
  data: new SlashCommandBuilder()
    .setName("yokai")
    .setDescription("Get a random yokai")
    .setDMPermission(false),
  run: async (bot, interaction) => {
    try {
      await interaction.deferReply();
      const raw = await fetch("https://yokai.com/?redirect_to=random", {
        redirect: "follow",
        headers: {
          "User-Agent": "MelodyIuvo (bot by Naomi Carrigan)"
        }
      });
      const text = await raw.text();
      const url = raw.url;
      const embed = new EmbedBuilder();
      const html = new JSDOM(text);
      embed.setTitle(
        html.window.document.querySelectorAll("h1")?.[1]?.textContent ||
          "Unknown Yokai"
      );
      embed.setDescription(
        (html.window.document
          .querySelector<HTMLDivElement>(".entry_content")
          ?.textContent?.slice(0, 200) || "Unknown Yokai") + "..."
      );
      embed.setImage(html.window.document.querySelector("img")?.src || null);
      embed.setURL(url);
      await interaction.editReply({
        embeds: [embed]
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
