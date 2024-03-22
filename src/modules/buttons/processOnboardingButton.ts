import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} from "discord.js";

import { ExtendedClient } from "../../interfaces/ExtendedClient";
import { errorHandler } from "../../utils/errorHandler";

/**
 * Exposes the onboarding modal to join the community.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {ButtonInteraction} interaction The interaction payload from Discord.
 */
export const processOnboardingButton = async (
  bot: ExtendedClient,
  interaction: ButtonInteraction
) => {
  try {
    const first = new TextInputBuilder()
      .setStyle(TextInputStyle.Paragraph)
      .setMaxLength(500)
      .setRequired(true)
      .setCustomId("why-join")
      .setLabel("Why do you want to join our community?");
    const second = new TextInputBuilder()
      .setStyle(TextInputStyle.Paragraph)
      .setMaxLength(500)
      .setRequired(true)
      .setCustomId("how-know")
      .setLabel("How do you know Naomi?");
    const third = new TextInputBuilder()
      .setStyle(TextInputStyle.Paragraph)
      .setMaxLength(500)
      .setRequired(true)
      .setCustomId("about-you")
      .setLabel("Tell us more about yourself!");
    const fourth = new TextInputBuilder()
      .setStyle(TextInputStyle.Paragraph)
      .setMaxLength(500)
      .setRequired(true)
      .setCustomId("socials")
      .setLabel("Social accounts you interact with Naomi from?");
    const fifth = new TextInputBuilder()
      .setStyle(TextInputStyle.Paragraph)
      .setMaxLength(500)
      .setRequired(true)
      .setCustomId("other")
      .setLabel("Anything else you'd like to share with us?");
    const firstRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
      first
    );
    const secondRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
      second
    );
    const thirdRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
      third
    );
    const fourthRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
      fourth
    );
    const fifthRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
      fifth
    );

    const modal = new ModalBuilder()
      .setCustomId("onboarding")
      .setTitle("Apply to join Naomi's community!")
      .addComponents(firstRow, secondRow, thirdRow, fourthRow, fifthRow);
    await interaction.showModal(modal);
  } catch (err) {
    await errorHandler(bot, "process onboarding button", err);
  }
};
