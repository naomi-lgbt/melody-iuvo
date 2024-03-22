import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Message
} from "discord.js";

import { ExtendedClient } from "../../interfaces/ExtendedClient";
import { errorHandler } from "../../utils/errorHandler";

/**
 * Generates the message with a button to click to start the onboarding process.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {Message} msg The message that triggered this request.
 */
export const postOnboardingForm = async (bot: ExtendedClient, msg: Message) => {
  try {
    await msg.channel.send({
      content:
        "Welcome to Naomi's Coven. Thank you for your interest in our community. To keep our vibes chill and close-knit, we ask that everyone who joins fill out a quick form. Once approved, you'll get the role to access the community.",
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setLabel("Open Form")
            .setCustomId("onboarding")
            .setEmoji("📋")
            .setStyle(ButtonStyle.Success)
        )
      ]
    });
    await msg.delete();
  } catch (err) {
    await errorHandler(bot, "post onboarding form", err);
  }
};
