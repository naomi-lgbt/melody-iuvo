import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

import { GameQueue } from "../config/GameQueue";
import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";

export const queue: Command = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("View Naomi's game queue for streams!"),
  run: async (bot, interaction) => {
    try {
      await interaction.deferReply();
      let index = 0;
      const first = new EmbedBuilder();
      first.setTitle(GameQueue[index].name);
      first.setURL(GameQueue[index].url);
      first.setImage(GameQueue[index].image);
      first.setDescription(
        `## Estimated playtime: ${GameQueue[index].time} hours\n### Time until first in queue: now\nTimes are estimated based on howlongtobeat.com and user reviews.`
      );
      first.setFooter({
        text: `Game ${index + 1} out of ${GameQueue.length}`,
      });

      const prev = new ButtonBuilder()
        .setCustomId("prev")
        .setEmoji("⬅️")
        .setStyle(ButtonStyle.Primary);
      const next = new ButtonBuilder()
        .setCustomId("next")
        .setEmoji("➡️")
        .setStyle(ButtonStyle.Primary);
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
        prev,
        next,
      ]);

      const res = await interaction.editReply({
        embeds: [first],
        components: [row],
      });

      const collector = res.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 1000 * 60 * 10,
      });

      collector.on("collect", async (i) => {
        if (i.user.id !== interaction.user.id) {
          await interaction.reply({
            content: "Clicking other peoples' buttons is most unkind.",
            ephemeral: true,
          });
          return;
        }
        await i.deferUpdate();
        i.customId === "next" ? index++ : index--;
        if (index >= GameQueue.length) {
          index = 0;
        }
        if (index < 0) {
          index = GameQueue.length - 1;
        }
        const embed = new EmbedBuilder();
        embed.setTitle(GameQueue[index].name);
        embed.setURL(GameQueue[index].url);
        embed.setImage(GameQueue[index].image);
        embed.setDescription(
          `## Estimated time: ${
            GameQueue[index].time
          } hours\n### Time until first in queue: ${
            index === 0
              ? "now"
              : String(
                  GameQueue.slice(0, index + 1).reduce(
                    (sum, game) => sum + game.time,
                    0
                  )
                ) + " hours"
          }\nTimes are estimated based on howlongtobeat.com and user reviews.`
        );
        embed.setFooter({
          text: `Game ${index + 1} out of ${GameQueue.length}`,
        });
        await i.editReply({
          embeds: [embed],
        });
      });

      collector.on("end", async () => {
        await interaction.editReply({
          components: [],
        });
      });
    } catch (err) {
      console.log(err);
      await errorHandler(bot, "queue command", err);
      await interaction.editReply({
        content:
          "Forgive me, but I failed to complete your request. Please try again later.",
      });
    }
  },
};
