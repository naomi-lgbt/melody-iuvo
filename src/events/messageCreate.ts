import { execSync } from "child_process";

import { ChannelType, Message, MessageType } from "discord.js";

import { Responses } from "../config/Responses";
import { ExtendedClient } from "../interfaces/ExtendedClient";
import { assignRoles } from "../modules/assignRoles";
import { calculateMessageCurrency } from "../modules/calculateMessageCurrency";
import { getResponseKey } from "../modules/getResponseKey";
import { logTicketMessage } from "../modules/logTicketMessage";
import { makeChange } from "../modules/makeChange";
import { auditGuildsAndDatabase } from "../modules/messages/auditGuildsAndDatabase";
import { postReactionRoles } from "../modules/messages/postReactionRoles";
import { proxyPluralMessage } from "../modules/messages/proxyPluralMessage";
import { pruneInactiveUsers } from "../modules/messages/pruneInactiveUsers";
import {
  isGoodMorning,
  isGoodNight,
  isSorry,
  isThanks
} from "../modules/messages/responseValidation";
import { startCounselPost } from "../modules/messages/startCounselPost";
import { sumCurrency } from "../modules/sumCurrency";
import { errorHandler } from "../utils/errorHandler";
import { getDatabaseRecord } from "../utils/getDatabaseRecord";
import { getRandomValue } from "../utils/getRandomValue";
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
    /**
     * We want to ignore all DMs.
     */
    if (message.channel.type === ChannelType.DM) {
      return;
    }
    /**
     * We actually want to delete Becca's level up messages from the
     * vent channel, so we run this before confirming the message comes
     * from a non-bot user.
     */
    if (message.channel?.id === bot.discord?.channels?.vent?.id) {
      setTimeout(
        async () =>
          /**
           * This can error on plural messages. We don't care if it
           * errors, because it should only error if the message is
           * already deleted.
           */
          await message.delete().catch(() => null),
        1000 * 60 * 60
      );
      return;
    }

    if (message.author.bot || !isGuildMessage(message)) {
      return;
    }

    const { content, member } = message;

    if (isOwner(member?.id) && content === "Melody, take a nap.") {
      await message.reply("G'night!");
      execSync("pm2 stop melody");
    }

    /**
     * We don't want to run these in the heavier vent channel and comfort channels.
     */
    if (
      message.channel.id !== bot.discord.channels.vent?.id &&
      !message.channel.name.startsWith("counsel") &&
      message.channel.name !== "partners"
    ) {
      if (
        (bot.user && message.mentions.has(bot.user)) ||
        /melody/i.test(content)
      ) {
        await message.reply({
          content: getRandomValue(
            Responses.melodyPing[getResponseKey(bot, message.member)]
          )
        });
      }
      if (message.author.id === bot.beanedUser) {
        await message.react("<a:beaned:1169327059919704176>");
      }
      if (
        isOwner(message.member.id) ||
        (bot.discord.roles.partner &&
          message.member.roles.cache.has(bot.discord.roles.partner.id))
      ) {
        await message.react("<a:love:1149580277220388985>");
      }
      if (
        bot.discord.roles.friend &&
        message.member.roles.cache.has(bot.discord.roles.friend.id)
      ) {
        await message.react("<a:lovelovelove:1149580280013791333>");
      }
      if (isGoodMorning(content) && message.type !== MessageType.Reply) {
        await message.reply({
          content: getRandomValue(
            Responses.greeting[getResponseKey(bot, member)]
          )
        });
      }
      if (isGoodNight(content) && message.type !== MessageType.Reply) {
        await message.reply({
          content: getRandomValue(
            Responses.goodbye[getResponseKey(bot, member)]
          )
        });
      }
      if (isSorry(content) && message.author.id !== bot.user?.id) {
        await message.reply({
          content: getRandomValue(
            Responses.sorry[getResponseKey(bot, member)]
          ).replace(/\{username\}/g, message.author.username)
        });
      }
      if (isThanks(content)) {
        const mentioned = message.mentions.members?.first();
        if (mentioned && mentioned.id !== bot.user?.id) {
          await message.channel.send({
            content: getRandomValue(
              Responses.thanks[getResponseKey(bot, mentioned)]
            ).replace(/\{username\}/g, mentioned.user.username || "friend")
          });
        }
      }
    }

    if (isOwner(message.author.id)) {
      if (content === "~counsel") {
        await startCounselPost(bot, message);
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
      if (content === "~audit") {
        await auditGuildsAndDatabase(bot, message);
        return;
      }
      if (content === "~roles") {
        const members = await bot.discord.guild?.members.fetch();
        if (!members) {
          await message.reply("Could not load members.");
          return;
        }
        await message.reply(`Assigning roles to ${members.size} members.`);
        for (const [, member] of members) {
          await assignRoles(bot, member);
        }
      }
    }

    if (
      !message.channel.isDMBased() &&
      message.channel.name.startsWith("ticket-")
    ) {
      const id = message.channel.id;
      const cached = bot.ticketLogs[id];
      if (!cached) {
        return;
      }
      await logTicketMessage(bot, message, cached);
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
        userId: message.author.id
      },
      data: {
        currency: {
          ...makeChange(total + currencyEarned)
        }
      }
    });
  } catch (err) {
    await errorHandler(bot, "message create event", err);
  }
};
