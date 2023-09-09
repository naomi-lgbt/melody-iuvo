import {
  Colors,
  EmbedBuilder,
  GuildMember,
  ModalSubmitInteraction,
} from "discord.js";
import { DateTime } from "luxon";

import { ExtendedClient } from "../../interfaces/ExtendedClient";
import { errorHandler } from "../../utils/errorHandler";

/**
 * Handles the age verification modal.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {ModalSubmitInteraction} interaction The interaction payload from Discord.
 */
export const handleAgeModal = async (
  bot: ExtendedClient,
  interaction: ModalSubmitInteraction
) => {
  try {
    await interaction.deferReply({ ephemeral: true });
    const { member, guild } = interaction;
    if (!member || !guild || !(member instanceof GuildMember)) {
      return;
    }

    const embed = new EmbedBuilder().setAuthor({
      name: member.user.username,
      iconURL: member.user.displayAvatarURL(),
    });
    embed.addFields([
      {
        name: "How did you find us?",
        value: interaction.fields.getTextInputValue("how-find"),
      },
    ]);
    const rawDate = interaction.fields.getTextInputValue("birthday");
    const age = Math.abs(
      DateTime.fromFormat(rawDate, "dd/MM/yyyy").diffNow("years").years
    );
    if (isNaN(age)) {
      await interaction.editReply({
        content: `${rawDate} does not appear to be in the correct format. Please use dd/mm/yyyy format.`,
      });
      return;
    }
    if (age < 18) {
      embed.setTitle("Age Verification Failed");
      embed.setDescription(
        `Age verification failed: ${rawDate} (${age} years old)`
      );
      embed.setColor(Colors.DarkRed);
      await bot.env.birthdayHook.send({ embeds: [embed] });
      await interaction.editReply({
        content: "You are not old enough to access this category.",
      });
      return;
    }
    embed.setTitle("Age Verification Passed");
    embed.setDescription(
      `Age verification passed: ${rawDate} (${Math.abs(
        Math.floor(age)
      )} years old)`
    );
    embed.setColor(Colors.DarkGreen);
    await bot.env.birthdayHook.send({ embeds: [embed] });

    await member.roles.add("1150088895782998087");
  } catch (err) {
    await errorHandler(bot, "handle age modal", err);
  }
};
