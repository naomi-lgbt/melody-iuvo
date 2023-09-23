import { Message } from "discord.js";

import { Responses } from "../config/Responses";
import { ExtendedClient } from "../interfaces/ExtendedClient";
import { calculateMessageCurrency } from "../modules/calculateMessageCurrency";
import { getResponseKey } from "../modules/getResponseKey";
import { logTicketMessage } from "../modules/logTicketMessage";
import { makeChange } from "../modules/makeChange";
import { postReactionRoles } from "../modules/messages/postReactionRoles";
import { proxyPluralMessage } from "../modules/messages/proxyPluralMessage";
import { pruneInactiveUsers } from "../modules/messages/pruneInactiveUsers";
import {
  isGoodMorning,
  isGoodNight,
  isSorry,
  isThanks,
} from "../modules/messages/responseValidation";
import { startAgeGate } from "../modules/messages/startAgeGate";
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

    const { content, member } = message;

    if (
      (bot.user && message.mentions.has(bot.user)) ||
      /melody/i.test(content)
    ) {
      await message.reply({
        content: Responses.melodyPing[getResponseKey(message.member)],
        stickers:
          getResponseKey(message.member) !== "default"
            ? []
            : ["1146308020444332042"],
      });
    }

    if (
      message.member.roles.cache.find((r) => r.name === "Naomi") ||
      message.member.roles.cache.find((r) => r.name === "cutie")
    ) {
      await message.react("<a:love:1149580277220388985>");
    }
    if (isGoodMorning(content)) {
      await message.reply({
        content: Responses.greeting[getResponseKey(member)],
      });
    }
    if (isGoodNight(content)) {
      await message.reply({
        content: Responses.goodbye[getResponseKey(member)],
      });
    }
    if (isSorry(content)) {
      await message.reply({
        content: Responses.sorry[getResponseKey(member)].replace(
          /\{username\}/g,
          message.author.username
        ),
      });
    }
    if (isThanks(content)) {
      const mentioned = message.mentions.members?.first();
      if (mentioned) {
        await message.channel.send({
          content: Responses.thanks[getResponseKey(mentioned)].replace(
            /\{username\}/g,
            mentioned.user.username || "friend"
          ),
        });
      }
    }

    if (isOwner(message.author.id)) {
      if (content === "~tickets") {
        await startTicketPost(bot, message);
        return;
      }
      if (content.startsWith("~prune")) {
        await pruneInactiveUsers(bot, message);
        return;
      }
      if (content.startsWith("~roles")) {
        await postReactionRoles(bot, message);
        return;
      }
      if (content === "~agegate") {
        await startAgeGate(bot, message);
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

    const prefixUsed = record.plurals.find((p) => content.startsWith(p.prefix));
    if (prefixUsed && !proxied) {
      await proxyPluralMessage(bot, message, prefixUsed);
      proxied = true;
    }

    // Currency Logic
    const total = sumCurrency(record.currency);
    const currencyEarned = calculateMessageCurrency(content);
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
