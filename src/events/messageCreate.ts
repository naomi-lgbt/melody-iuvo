import { Message } from "discord.js";

import { Responses } from "../config/Responses";
import { ExtendedClient } from "../interfaces/ExtendedClient";
import { calculateMessageCurrency } from "../modules/calculateMessageCurrency";
import { logTicketMessage } from "../modules/logTicketMessage";
import { makeChange } from "../modules/makeChange";
import { proxyPluralMessage } from "../modules/messages/proxyPluralMessage";
import { pruneInactiveUsers } from "../modules/messages/pruneInactiveUsers";
import { startTicketPost } from "../modules/messages/startTicketPost";
import { sumCurrency } from "../modules/sumCurrency";
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

    if (
      (bot.user && message.mentions.has(bot.user)) ||
      /melody/i.test(message.content)
    ) {
      const {
        author: { id },
      } = message;
      await message.reply({
        content: Responses.melodyPing[id] || "",
        stickers: ["1146308020444332042"],
      });
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
      await logTicketMessage(bot, message, bot.ticketLogs[id]);
    }

    const record = await getDatabaseRecord(bot, message.author.id);

    // Plural Logic
    let proxied = false;
    if (record.front) {
      const identity = record.plurals.find((p) => p.name === record.front);
      if (identity) {
        await proxyPluralMessage(bot, message, identity);
        proxied = true;
      }
    }

    const prefixUsed = record.plurals.find((p) =>
      message.content.startsWith(p.prefix)
    );
    if (prefixUsed && !proxied) {
      await proxyPluralMessage(bot, message, prefixUsed);
      proxied = true;
    }

    // Currency Logic
    const total = sumCurrency(record.currency);
    const currencyEarned = calculateMessageCurrency(message.content);
    await bot.db.users.update({
      where: {
        userId: message.author.id,
      },
      data: {
        currency: {
          ...makeChange(total + currencyEarned),
        },
      },
    });
  } catch (err) {
    await errorHandler(bot, "message create event", err);
  }
};
