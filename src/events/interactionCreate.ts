import { Interaction } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { ageGateModal } from "../modules/buttons/ageGateModal";
import { processRoleButton } from "../modules/buttons/processRoleButton";
import { questionAnswer } from "../modules/buttons/questionAnswer";
import { questionDelete } from "../modules/buttons/questionDelete";
import { ticketClaimHandler } from "../modules/buttons/ticketClaim";
import { ticketCloseHandler } from "../modules/buttons/ticketClose";
import { ticketOpenHandler } from "../modules/buttons/ticketOpen";
import { wordGuess } from "../modules/buttons/wordGuess";
import { handleAgeModal } from "../modules/modals/handleAgeModal";
import { handleTicketModal } from "../modules/modals/handleTicketModal";
import { processAnswerModal } from "../modules/modals/processAnswerModal";
import { processQuestionModal } from "../modules/modals/processQuestionModal";
import { processWordGuess } from "../modules/modals/processWordGuess";
import { errorHandler } from "../utils/errorHandler";
import { isGuildButtonCommand, isGuildSlashCommand } from "../utils/typeGuards";

/**
 * Handles the InteractionCreate event from Discord.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {Interaction} interaction The interaction payload from Discord.
 */
export const interactionCreate = async (
  bot: ExtendedClient,
  interaction: Interaction
) => {
  try {
    if (interaction.isChatInputCommand()) {
      if (!isGuildSlashCommand(interaction)) {
        await interaction.reply({
          content:
            "Forgive me, but this can only be done within Naomi's community.",
        });
        return;
      }
      const target = bot.commands.find(
        (c) => c.data.name === interaction.commandName
      );
      if (!target) {
        await interaction.reply({
          content:
            "My deepest apologies, but I cannot follow those instructions at this time.",
        });
        return;
      }
      await target.run(bot, interaction);
    }

    if (interaction.isButton()) {
      if (!isGuildButtonCommand(interaction)) {
        await interaction.editReply({
          content:
            "Forgive me, but this can only be done within Naomi's community.",
        });
        return;
      }
      if (interaction.customId.startsWith("role")) {
        await processRoleButton(bot, interaction);
      }
      if (interaction.customId.startsWith("word-")) {
        await wordGuess(bot, interaction);
      }
      if (interaction.customId === "answer") {
        await questionAnswer(bot, interaction);
      }
      if (interaction.customId.startsWith("delete-")) {
        await questionDelete(bot, interaction);
      }

      const id = interaction.customId;
      switch (id) {
        case "ticket":
          await ticketOpenHandler(bot, interaction);
          return;
        case "claim":
          await ticketClaimHandler(bot, interaction);
          return;
        case "close":
          await ticketCloseHandler(bot, interaction);
          return;
        case "age-gate":
          await ageGateModal(bot, interaction);
      }
    }
    if (interaction.isModalSubmit()) {
      if (interaction.customId.startsWith("word-")) {
        await interaction.deferReply({ ephemeral: true });
        await processWordGuess(bot, interaction);
      }
      if (interaction.customId === "ticket-modal") {
        await handleTicketModal(bot, interaction);
      }
      if (interaction.customId === "ask") {
        await processQuestionModal(bot, interaction);
      }
      if (interaction.customId === "answer") {
        await processAnswerModal(bot, interaction);
      }
      if (interaction.customId === "age-verify") {
        await handleAgeModal(bot, interaction);
      }
    }
  } catch (err) {
    await errorHandler(bot, "interaction create event", err);
    if (!interaction.isAutocomplete()) {
      if (!interaction.deferred && !interaction.replied) {
        await interaction.deferReply({ ephemeral: true });
      }
      await interaction.editReply({
        content:
          "Forgive me, but I failed to complete your request. Please try again later.",
      });
      return;
    }
  }
};
