import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  SlashCommandBuilder
} from "discord.js";

import { GameQueue } from "../config/GameQueue";
import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";

export const queue: Command = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("View Naomi's game queue for streams!")
    .setDMPermission(false),
  run: async (bot, interaction) => {
    try {
      await interaction.deferReply();
      let index = 0;
      const first = new EmbedBuilder();
      const game = GameQueue[index];
      if (!game) {
        await interaction.editReply({
          content: "There was an error loading the queue."
        });
        return;
      }
      first.setTitle(game.name);
      first.setURL(game.url);
      first.setImage(game.image);
      first.setFooter({
        text: `Game ${index + 1} out of ${GameQueue.length}`
      });
      if (game.purchased) {
        first.addFields([
          {
            name: "Community Selected",
            value:
              "A member of the community redeemed NaomiCoin to add this to the pool of games. Naomi will prioritise this game in her schedule."
          }
        ]);
      }

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
        next
      ]);

      const res = await interaction.editReply({
        content:
          "These are the games Naomi intends to select from when building her stream schedule. They are in no particular order. You CAN redeem NaomiCoin to select a new game to be used for her next week's stream schedule.",
        embeds: [first],
        components: [row]
      });

      const collector = res.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 1000 * 60 * 10
      });

      collector.on("collect", async (i) => {
        if (i.user.id !== interaction.user.id) {
          await interaction.reply({
            content: "Clicking other peoples' buttons is most unkind.",
            ephemeral: true
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
        const game = GameQueue[index];
        if (!game) {
          await interaction.editReply({
            content: "There was an error loading the queue.",
            embeds: [],
            components: []
          });
          return;
        }
        const embed = new EmbedBuilder();
        embed.setTitle(game.name);
        embed.setURL(game.url);
        embed.setImage(game.image);
        if (game.purchased) {
          embed.addFields([
            {
              name: "Community Selected",
              value:
                "A member of the community redeemed NaomiCoin to add this to the pool of games. Naomi will prioritise this game in her schedule."
            }
          ]);
        }
        embed.setFooter({
          text: `Game ${index + 1} out of ${GameQueue.length}`
        });
        await i.editReply({
          embeds: [embed]
        });
      });

      collector.on("end", async () => {
        await interaction.editReply({
          components: []
        });
      });
    } catch (err) {
      await errorHandler(bot, "queue command", err);
      await interaction.editReply({
        content:
          "Forgive me, but I failed to complete your request. Please try again later."
      });
    }
  }
};
