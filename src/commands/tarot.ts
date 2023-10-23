import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import rand from "random";

import { TarotCards, TarotChoices, TarotHeaders } from "../config/TarotCards";
import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";

const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = rand.uniformInt(0, i)();
    [array[i], array[j]] = [array[j] as T, array[i] as T];
  }
  return array;
};

export const tarot: Command = {
  data: new SlashCommandBuilder()
    .setName("tarot")
    .setDescription("Get a daily tarot reading.")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("What type of reading would you like?")
        .addChoices(
          ...Object.entries(TarotChoices).map(([value, name]) => ({
            name,
            value
          }))
        )
        .setRequired(true)
    ),
  run: async (bot, interaction) => {
    try {
      await interaction.deferReply();

      const cached = bot.cache.tarot[interaction.user.id]?.lastPlayed ?? 0;
      const yesterday = Date.now() - 1000 * 60 * 60 * 24;
      if (cached > yesterday) {
        await interaction.editReply({
          content:
            "It is dangerous to do more than one reading per day. You risk angering many spirits."
        });
        return;
      }

      const type = interaction.options.getString(
        "type",
        true
      ) as keyof typeof TarotChoices;

      if (!TarotChoices[type]) {
        await interaction.editReply({
          content: "I am not quite sure how to do that reading..."
        });
        return;
      }

      const [first, second, third, fourth, fifth] = shuffleArray([
        ...TarotCards
      ]).slice(0, 5);

      if (!first || !second || !third || !fourth || !fifth) {
        await interaction.editReply({
          content:
            "Something went wrong with doing your reading. Please try again later."
        });
        return;
      }

      bot.cache.tarot[interaction.user.id] = {
        lastPlayed: Date.now()
      };

      const embed = new EmbedBuilder();
      embed.setTitle("Your Tarot Reading");
      embed.setDescription(TarotChoices[type]);
      embed.addFields([
        {
          name: TarotHeaders[type].first,
          value: rand.boolean()
            ? `**${first.name}**: ${first.meaning}`
            : `**${first.name} Reversed**: ${first.reversed}`
        },
        {
          name: TarotHeaders[type].second,
          value: rand.boolean()
            ? `**${second.name}**: ${second.meaning}`
            : `**${second.name} Reversed**: ${second.reversed}`
        },
        {
          name: TarotHeaders[type].third,
          value: rand.boolean()
            ? `**${third.name}**: ${third.meaning}`
            : `**${third.name} Reversed**: ${third.reversed}`
        },
        {
          name: TarotHeaders[type].fourth,
          value: rand.boolean()
            ? `**${fourth.name}**: ${fourth.meaning}`
            : `**${fourth.name} Reversed**: ${fourth.reversed}`
        },
        {
          name: TarotHeaders[type].fifth,
          value: rand.boolean()
            ? `**${fifth.name}**: ${fifth.meaning}`
            : `**${fifth.name} Reversed**: ${fifth.reversed}`
        }
      ]);
      await interaction.editReply({
        embeds: [embed]
      });
    } catch (err) {
      await errorHandler(bot, "tarot command", err);
      await interaction.editReply({
        content:
          "Forgive me, but I failed to complete your request. Please try again later."
      });
    }
  }
};
