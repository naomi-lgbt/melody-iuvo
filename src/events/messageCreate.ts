import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
} from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { logMessage } from "../modules/logTicketMessage";
import { errorHandler } from "../utils/errorHandler";
import { getDatabaseRecord } from "../utils/getDatabaseRecord";
import { isOwner } from "../utils/isOwner";
import { logHandler } from "../utils/logHandler";

/**
 * Handles the MessageCreate event from Discord.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {Message} message The message payload from Discord.
 */
export const messageCreate = async (bot: ExtendedClient, message: Message) => {
  try {
    if (message.author.bot || !message.guild) {
      return;
    }

    if (isOwner(message.author.id)) {
      if (message.content === "~tickets") {
        const embed = new EmbedBuilder();
        embed.setTitle("Need Help?");
        embed.setDescription(
          "If you need help with one of our projects, and you want to speak with our support team privately, you can open a ticket!\n\nClick the button below to open a private ticket with the support team."
        );
        embed.setColor("#0099ff");

        const button = new ButtonBuilder()
          .setLabel("Open a Ticket!")
          .setEmoji("❔")
          .setStyle(ButtonStyle.Primary)
          .setCustomId("ticket");

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
        await message.channel.send({ embeds: [embed], components: [row] });
      }
      if (message.content.startsWith("~prune")) {
        const dryrun = message.content.includes("--dryrun");
        const records = await bot.db.users.findMany();
        const guildMembers = await message.guild.members.fetch();
        let count = 0;
        for (const user of guildMembers.values()) {
          if (user.user.bot || !user.kickable) {
            continue;
          }
          const record = records.find((r) => r.userId === user.id);
          if (!record) {
            await getDatabaseRecord(bot, user.id);
            continue;
          }
          // check if user.timestamp is older than 30 days
          if (record.timestamp < new Date(Date.now() - 2592000000)) {
            if (!dryrun) {
              await user
                .kick("Failed activity requirement.")
                .catch(() => logHandler.error(`Failed to kick ${user.id}`));
              await bot.db.users.delete({
                where: {
                  userId: user.id,
                },
              });
            }
            count++;
          }
        }
        await message.reply(
          dryrun
            ? `Would kick ${count} inactive users.`
            : `Kicked ${count} inactive users.`
        );
        return;
      }
    }

    if (
      !message.channel.isDMBased() &&
      message.channel.name.startsWith("ticket-")
    ) {
      const id = message.channel.id;
      if (!bot.ticketLogs[id]) {
        return;
      }
      await logMessage(bot, message, bot.ticketLogs[id]);
    }

    await getDatabaseRecord(bot, message.author.id);
  } catch (err) {
    await errorHandler(bot, "message create event", err);
  }
};
