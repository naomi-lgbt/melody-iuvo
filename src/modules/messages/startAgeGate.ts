import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message
} from "discord.js";

import { ExtendedClient } from "../../interfaces/ExtendedClient";
import { errorHandler } from "../../utils/errorHandler";

/**
 * Generates the post for members to confirm their age.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {Message} message The message payload from Discord.
 */
export const startAgeGate = async (bot: ExtendedClient, message: Message) => {
  try {
    const button = new ButtonBuilder()
      .setCustomId("age-gate")
      .setLabel("Enter Your Age")
      .setEmoji("🔞")
      .setStyle(ButtonStyle.Primary);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([button]);
    const embed = new EmbedBuilder()
      .setTitle("Age Verification")
      .setDescription(
        "This category is intended for members of 18 years in age or older. To gain access to this category, you'll need to provide your birthday through this system. Your birthday will be logged in a private logging channel in this server, for our own safety."
      );
    await message.channel.send({
      embeds: [embed],
      components: [row]
    });
  } catch (err) {
    await errorHandler(bot, "start age gate", err);
  }
};
