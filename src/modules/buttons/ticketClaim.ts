import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Embed,
  GuildMember,
  Message
} from "discord.js";

import { TicketSupportRole } from "../../config/Tickets";
import { ButtonHandler } from "../../interfaces/ButtonHandler";
import { errorHandler } from "../../utils/errorHandler";
import { isOwner } from "../../utils/isOwner";

/**
 * Handles the process of claiming a ticket.
 */
export const ticketClaimHandler: ButtonHandler = async (
  Melody,
  interaction
) => {
  try {
    await interaction.deferReply({ ephemeral: true });
    const { guild, message, member } = interaction;
    const { embeds } = message;
    const supportRole = await guild.roles.fetch(TicketSupportRole);

    if (!supportRole) {
      await interaction.editReply("Cannot find support role!");
      return;
    }

    const isSupport = (member as GuildMember).roles.cache.has(supportRole.id);

    if (!isSupport && !isOwner(interaction.user.id)) {
      await interaction.editReply({
        content: "Only support members can claim a ticket."
      });
      return;
    }

    const ticketEmbed = embeds[0] as Embed;
    const updatedEmbed = {
      title: ticketEmbed.title || "Lost the Title",
      description: ticketEmbed.description || "Lost the Description",
      fields: [{ name: "Claimed by:", value: `<@${member.user.id}>` }]
    };

    const claimButton = new ButtonBuilder()
      .setCustomId("claim")
      .setStyle(ButtonStyle.Success)
      .setLabel("Claim this ticket!")
      .setEmoji("✋")
      .setDisabled(true);
    const closeButton = new ButtonBuilder()
      .setCustomId("close")
      .setStyle(ButtonStyle.Danger)
      .setLabel("Close this ticket!")
      .setEmoji("🗑️");

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
      claimButton,
      closeButton
    ]);

    await (message as Message).edit({
      embeds: [updatedEmbed],
      components: [row]
    });

    await interaction.editReply(
      "I have marked you as responsible for this query."
    );
  } catch (err) {
    await errorHandler(Melody, "ticket claim handler", err);
    await interaction.editReply({
      content:
        "Forgive me, but I failed to complete your request. Please try again later."
    });
  }
};
