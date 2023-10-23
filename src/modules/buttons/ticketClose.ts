import { GuildMember, EmbedBuilder, TextChannel } from "discord.js";

import { TicketSupportRole } from "../../config/Tickets";
import { ButtonHandler } from "../../interfaces/ButtonHandler";
import { generateLogs } from "../../modules/generateLogs";
import { errorHandler } from "../../utils/errorHandler";
import { isOwner } from "../../utils/isOwner";

/**
 * Handles closing a ticket.
 */
export const ticketCloseHandler: ButtonHandler = async (bot, interaction) => {
  try {
    await interaction.deferReply({ ephemeral: true });
    const { guild, member, channel } = interaction;

    if (!guild || !member || !channel) {
      await interaction.editReply({
        content: "Error finding the guild!"
      });
      return;
    }

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

    const logEmbed = new EmbedBuilder();
    logEmbed.setTitle("Ticket Closed");
    logEmbed.setDescription(`Ticket closed by <@!${member.user.id}>`);
    logEmbed.addFields({
      name: "User",
      value:
        (channel as TextChannel)?.name.split("-").slice(1).join("-") ||
        "unknown"
    });

    const logFile = await generateLogs(bot, channel.id);
    await bot.env.ticketLogHook.send({ embeds: [logEmbed], files: [logFile] });
    await channel.delete();
  } catch (err) {
    await errorHandler(bot, "close handler", err);
    await interaction.editReply({
      content:
        "Forgive me, but I failed to complete your request. Please try again later."
    });
  }
};
