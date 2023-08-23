import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  ModalSubmitInteraction,
  TextChannel,
} from "discord.js";

import { TicketSupportRole } from "../config/Tickets";
import { ExtendedClient } from "../interfaces/ExtendedClient";

import { createLogFile } from "./createLogFile";

/**
 * Handles responding to the ticket modal.
 *
 * @param {ExtendedClient} bot The bot's discord instance.
 * @param {ModalSubmitInteraction} interaction The interaction payload from Discord.
 */
export const handleTicketModal = async (
  bot: ExtendedClient,
  interaction: ModalSubmitInteraction
) => {
  await interaction.deferReply({ ephemeral: true });
  const { guild, user, channel } = interaction;
  const reason = interaction.fields.getTextInputValue("reason");

  if (!guild || !channel || !("threads" in channel)) {
    await interaction.editReply(
      "Forgive me, but this can only be done within Naomi's community."
    );
    return;
  }

  const claimButton = new ButtonBuilder()
    .setCustomId("claim")
    .setStyle(ButtonStyle.Success)
    .setLabel("Claim this ticket!")
    .setEmoji("✋");
  const closeButton = new ButtonBuilder()
    .setCustomId("close")
    .setStyle(ButtonStyle.Danger)
    .setLabel("Close this ticket!")
    .setEmoji("🗑️");

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
    claimButton,
    closeButton,
  ]);

  const ticketEmbed = new EmbedBuilder();
  ticketEmbed.setTitle("Ticket Created");
  ticketEmbed.setDescription(`<@!${user.id}> opened a ticket for:\n${reason}`);

  const ticketThread = await (channel as TextChannel).threads.create({
    name: `ticket-${user.username}`,
    type: ChannelType.PrivateThread,
  });
  await ticketThread.members.add(user.id);
  await ticketThread.send({
    content: `<@&${TicketSupportRole}>, a ticket has been opened!`,
    embeds: [ticketEmbed],
    components: [row],
  });
  await createLogFile(bot, ticketThread.id, user.tag, reason);
  await interaction.editReply(
    "Your ticket channel has been created! Please head there and describe the issue you are having."
  );
};
