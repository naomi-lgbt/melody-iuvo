import { Message } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { logMessage } from "../modules/logTicketMessage";
import { pruneInactiveUsers } from "../modules/messages/pruneInactiveUsers";
import { startTicketPost } from "../modules/messages/startTicketPost";
import { errorHandler } from "../utils/errorHandler";
import { getDatabaseRecord } from "../utils/getDatabaseRecord";
import { isOwner } from "../utils/isOwner";
import { isGuildMessage } from "../utils/typeGuards";

/**
 * Handles the MessageCreate event from Discord.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {Message} message The message payload from Discord.
 */
export const messageCreate = async (bot: ExtendedClient, message: Message) => {
  try {
    if (message.author.bot || !isGuildMessage(message)) {
      return;
    }

    if (isOwner(message.author.id)) {
      if (message.content === "~tickets") {
        await startTicketPost(bot, message);
        return;
      }
      if (message.content.startsWith("~prune")) {
        await pruneInactiveUsers(bot, message);
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
