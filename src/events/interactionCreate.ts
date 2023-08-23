import {
  ActionRowBuilder,
  Interaction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { ticketClaimHandler } from "../modules/buttons/ticketClaim";
import { ticketCloseHandler } from "../modules/buttons/ticketClose";
import { ticketOpenHandler } from "../modules/buttons/ticketOpen";
import { handleTicketModal } from "../modules/handleTicketModal";
import { processQuestionModal } from "../modules/processQuestionModal";
import { processWordGuess } from "../modules/processWordGuess";
import { errorHandler } from "../utils/errorHandler";
import { isOwner } from "../utils/isOwner";
import {
  isGuildButtonCommand,
  isGuildCommandCommand,
} from "../utils/typeGuards";

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
      if (!isGuildCommandCommand(interaction)) {
        await interaction.editReply({
          content:
            "Forgive me, but this can only be done within Naomi's community.",
        });
        return;
      }
      const target = bot.commands.find(
        (c) => c.data.name === interaction.commandName
      );
      if (!target) {
        await interaction.editReply({
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
      if (interaction.customId.startsWith("word-")) {
        const id = interaction.customId.split("-")[1];
        if (id !== interaction.user.id) {
          await interaction.reply({
            content:
              "Oh my, how on earth did you find this? This is not yours.",
            ephemeral: true,
          });
        }
        if (!bot.cache.wordGame[id]) {
          await interaction.reply({
            content:
              "This might be a stale message, as you don't have a game in the cache. Please start a new game.",
            ephemeral: true,
          });
          return;
        }
        const input = new TextInputBuilder()
          .setCustomId("guess")
          .setLabel("What is your guess?")
          .setStyle(TextInputStyle.Short)
          .setMinLength(5)
          .setMaxLength(5)
          .setRequired(true);
        const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
          input
        );
        const modal = new ModalBuilder()
          .setTitle("Guess the word!")
          .setCustomId(`word-${id}`)
          .addComponents(row);
        await interaction.showModal(modal);
      }

      if (interaction.customId === "answer") {
        if (!isOwner(interaction.user.id)) {
          await interaction.reply({
            content: "Only Naomi can click these buttons.",
            ephemeral: true,
          });
          return;
        }
        const input = new TextInputBuilder()
          .setCustomId("answer")
          .setLabel("How do you answer?")
          .setMaxLength(2000)
          .setRequired(true)
          .setStyle(TextInputStyle.Paragraph);
        const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
          input
        );
        const modal = new ModalBuilder()
          .setCustomId("answer")
          .setTitle("Answer Question")
          .addComponents(row);
        await interaction.showModal(modal);
      }
      if (interaction.customId.startsWith("delete-")) {
        if (!isOwner(interaction.user.id)) {
          await interaction.reply({
            content: "Only Naomi can click these buttons.",
            ephemeral: true,
          });
          return;
        }
        await interaction.deferReply({ ephemeral: true });
        const id = interaction.customId.split("-")[1];
        await interaction.message.edit({
          content: `This message has been flagged for violating our community guidelines.`,
          components: [],
        });
        await interaction.editReply({
          content: `For moderation purposes, that question was asked by <@!${id}> (${id}).`,
        });
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
        await interaction.deferReply({
          ephemeral: true,
        });
        if (!interaction.message) {
          await interaction.editReply({
            content: "Something went wrong. Please try again.",
          });
          return;
        }
        const answer = interaction.fields.getTextInputValue("answer");
        await interaction.message.edit({
          content: `**${interaction.message.content
            .split("\n")
            .slice(-1)}**\n\n${answer}`,
          components: [],
        });
        await interaction.editReply({
          content: "Your answer has been submitted.",
        });
      }
    }
  } catch (err) {
    await errorHandler(bot, "interaction create event", err);
    if (!interaction.isAutocomplete()) {
      await interaction.editReply({
        content:
          "Forgive me, but I failed to complete your request. Please try again later.",
      });
    }
  }
};
