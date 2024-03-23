import { Interaction } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { processComfortButton } from "../modules/buttons/processComfortButton";
import { processOnboardingButton } from "../modules/buttons/processOnboardingButton";
import { processRoleButton } from "../modules/buttons/processRoleButton";
import { questionAnswer } from "../modules/buttons/questionAnswer";
import { questionDelete } from "../modules/buttons/questionDelete";
import { ticketClaimHandler } from "../modules/buttons/ticketClaim";
import { ticketCloseHandler } from "../modules/buttons/ticketClose";
import { ticketOpenHandler } from "../modules/buttons/ticketOpen";
import { wordGuess } from "../modules/buttons/wordGuess";
import { handleTicketModal } from "../modules/modals/handleTicketModal";
import { processAnswerModal } from "../modules/modals/processAnswerModal";
import { processOnboardingModal } from "../modules/modals/processOnboardingModal";
import { processQuestionModal } from "../modules/modals/processQuestionModal";
import { processModAction } from "../modules/processModAction";
import { errorHandler } from "../utils/errorHandler";
import {
  isGuildButtonCommand,
  isGuildSlashCommand,
  isModerationAction
} from "../utils/typeGuards";

/**
 * Handles the InteractionCreate event from Discord.
 *
 * @param {ExtendedClient} Melody The Melody's Discord instance.
 * @param {Interaction} interaction The interaction payload from Discord.
 */
export const interactionCreate = async (
  Melody: ExtendedClient,
  interaction: Interaction
) => {
  try {
    if (interaction.isContextMenuCommand()) {
      if (isModerationAction(interaction.commandName)) {
        await processModAction(
          Melody,
          interaction,
          interaction.commandName,
          interaction.options.getUser("user", true)
        );
        return;
      }
      const context = Melody.contexts.find(
        (c) => c.data.name === interaction.commandName
      );
      if (!context) {
        await interaction.reply({
          content: `My deepest apologies, but I cannot find a ${interaction.commandName} command.`
        });
        return;
      }
      await context.run(Melody, interaction);
    }
    if (interaction.isChatInputCommand()) {
      if (!isGuildSlashCommand(interaction)) {
        await interaction.reply({
          content:
            "Forgive me, but this can only be done within Naomi's community."
        });
        return;
      }
      const target = Melody.commands.find(
        (c) => c.data.name === interaction.commandName
      );
      if (!target) {
        await interaction.reply({
          content:
            "My deepest apologies, but I cannot follow those instructions at this time."
        });
        return;
      }
      await target.run(Melody, interaction);
    }

    if (interaction.isButton()) {
      if (!isGuildButtonCommand(interaction)) {
        await interaction.editReply({
          content:
            "Forgive me, but this can only be done within Naomi's community."
        });
        return;
      }
      if (interaction.customId === "comfort") {
        await processComfortButton(Melody, interaction);
      }
      if (interaction.customId.startsWith("role")) {
        await processRoleButton(Melody, interaction);
      }
      if (interaction.customId.startsWith("word-")) {
        await wordGuess(Melody, interaction);
      }
      if (interaction.customId === "answer") {
        await questionAnswer(Melody, interaction);
      }
      if (interaction.customId.startsWith("delete-")) {
        await questionDelete(Melody, interaction);
      }
      if (interaction.customId === "onboarding") {
        await processOnboardingButton(Melody, interaction);
      }

      const id = interaction.customId;
      switch (id) {
        case "ticket":
          await ticketOpenHandler(Melody, interaction);
          return;
        case "claim":
          await ticketClaimHandler(Melody, interaction);
          return;
        case "close":
          await ticketCloseHandler(Melody, interaction);
          return;
      }
    }
    if (interaction.isModalSubmit()) {
      if (interaction.customId === "ticket-modal") {
        await handleTicketModal(Melody, interaction);
      }
      if (interaction.customId === "ask") {
        await processQuestionModal(Melody, interaction);
      }
      if (interaction.customId === "answer") {
        await processAnswerModal(Melody, interaction);
      }
      if (interaction.customId === "onboarding") {
        await processOnboardingModal(Melody, interaction);
      }
    }
  } catch (err) {
    await errorHandler(Melody, "interaction create event", err);
    if (!interaction.isAutocomplete()) {
      if (!interaction.deferred && !interaction.replied) {
        await interaction.deferReply({ ephemeral: true });
      }
      await interaction.editReply({
        content:
          "Forgive me, but I failed to complete your request. Please try again later."
      });
      return;
    }
  }
};
