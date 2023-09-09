import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

import { ButtonHandler } from "../../interfaces/ButtonHandler";
import { errorHandler } from "../../utils/errorHandler";

/**
 * Shows the age gate modal to the user.
 */
export const ageGateModal: ButtonHandler = async (bot, interaction) => {
  try {
    const bDay = new TextInputBuilder()
      .setCustomId("birthday")
      .setLabel("What is your birthday in DD/MM/YYYY format?")
      .setRequired(true)
      .setStyle(TextInputStyle.Short);
    const howFind = new TextInputBuilder()
      .setCustomId("how-find")
      .setLabel("How did you find our server?")
      .setRequired(true)
      .setStyle(TextInputStyle.Paragraph)
      .setMaxLength(1024);
    const bDayRow = new ActionRowBuilder<TextInputBuilder>().addComponents([
      bDay,
    ]);
    const howFindRow = new ActionRowBuilder<TextInputBuilder>().addComponents([
      howFind,
    ]);
    const modal = new ModalBuilder()
      .addComponents([bDayRow, howFindRow])
      .setTitle("Age Verification")
      .setCustomId("age-verify");
    await interaction.showModal(modal);
  } catch (err) {
    await errorHandler(bot, "age gate modal", err);
  }
};
