import { execSync } from "child_process";

import { ChannelType, Message, MessageType } from "discord.js";

import { Responses } from "../config/Responses";
import { ExtendedClient } from "../interfaces/ExtendedClient";
import { assignRoles } from "../modules/assignRoles";
import { getResponseKey } from "../modules/getResponseKey";
import { logTicketMessage } from "../modules/logTicketMessage";
import { auditGuildsAndDatabase } from "../modules/messages/auditGuildsAndDatabase";
import { postOnboardingForm } from "../modules/messages/postOnboardingForm";
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
import { errorHandler } from "../utils/errorHandler";
import { getDatabaseRecord } from "../utils/getDatabaseRecord";
import { getRandomValue } from "../utils/getRandomValue";
import { isOwner } from "../utils/isOwner";
import { isGuildMessage } from "../utils/typeGuards";

/**
 * Handles the MessageCreate event from Discord.
 *
 * @param {ExtendedClient} Melody The Melody's Discord instance.
 * @param {Message} message The message payload from Discord.
 */
export const messageCreate = async (
  Melody: ExtendedClient,
  message: Message
) => {
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
     * from a non-Melody user.
     */
    if (message.channel?.id === Melody.discord?.channels?.vent?.id) {
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
      message.channel.id !== Melody.discord.channels.vent?.id &&
      !message.channel.name.startsWith("counsel") &&
      message.channel.name !== "partners"
    ) {
      if (
        (Melody.user &&
          message.mentions.has(Melody.user, {
            ignoreEveryone: true,
            ignoreRepliedUser: true
          })) ||
        /melody/i.test(content)
      ) {
        await message.reply({
          content: getRandomValue(
            Responses.melodyPing[getResponseKey(Melody, message.member)]
          )
        });
      }
      if (message.author.id === Melody.beanedUser) {
        await message.react("<a:beaned:1169327059919704176>");
      }
      if (
        isOwner(message.member.id) ||
        (Melody.discord.roles.partner &&
          message.member.roles.cache.has(Melody.discord.roles.partner.id))
      ) {
        await message.react("<a:love:1149580277220388985>");
      }
      if (
        Melody.discord.roles.friend &&
        message.member.roles.cache.has(Melody.discord.roles.friend.id)
      ) {
        await message.react("<a:lovelovelove:1149580280013791333>");
      }
      if (isGoodMorning(content) && message.type !== MessageType.Reply) {
        await message.reply({
          content: getRandomValue(
            Responses.greeting[getResponseKey(Melody, member)]
          )
        });
      }
      if (isGoodNight(content) && message.type !== MessageType.Reply) {
        await message.reply({
          content: getRandomValue(
            Responses.goodbye[getResponseKey(Melody, member)]
          )
        });
      }
      if (isSorry(content) && message.author.id !== Melody.user?.id) {
        await message.reply({
          content: getRandomValue(
            Responses.sorry[getResponseKey(Melody, member)]
          ).replace(/\{username\}/g, message.author.username)
        });
      }
      if (isThanks(content)) {
        const mentioned = message.mentions.members?.first();
        if (mentioned && mentioned.id !== Melody.user?.id) {
          await message.channel.send({
            content: getRandomValue(
              Responses.thanks[getResponseKey(Melody, mentioned)]
            ).replace(/\{username\}/g, mentioned.user.username || "friend")
          });
        }
      }
    }

    if (isOwner(message.author.id)) {
      if (content === "~counsel") {
        await startCounselPost(Melody, message);
        return;
      }
      if (content.startsWith("~prune")) {
        await pruneInactiveUsers(Melody, message);
        return;
      }
      if (content.startsWith("~roles")) {
        await postReactionRoles(Melody, message);
        return;
      }
      if (content === "~audit") {
        await auditGuildsAndDatabase(Melody, message);
        return;
      }
      if (content === "~roles") {
        const members = await Melody.discord.guild?.members.fetch();
        if (!members) {
          await message.reply("Could not load members.");
          return;
        }
        await message.reply(`Assigning roles to ${members.size} members.`);
        for (const [, member] of members) {
          await assignRoles(Melody, member);
        }
      }
      if (content === "~onboarding") {
        await postOnboardingForm(Melody, message);
      }
    }

    if (
      !message.channel.isDMBased() &&
      message.channel.name.startsWith("ticket-")
    ) {
      const id = message.channel.id;
      const cached = Melody.ticketLogs[id];
      if (!cached) {
        return;
      }
      await logTicketMessage(Melody, message, cached);
    }

    const record = await getDatabaseRecord(Melody, message.author.id);

    // Plural Logic
    let proxied = false;
    if (record.front) {
      const identity = record.plurals.find((p) => p.name === record.front);
      if (identity) {
        await proxyPluralMessage(Melody, message, identity);
        proxied = true;
      }
    }

    const prefixUsed = record.plurals.find((p) => content.startsWith(p.prefix));
    if (prefixUsed && !proxied) {
      await proxyPluralMessage(Melody, message, prefixUsed);
      proxied = true;
    }
  } catch (err) {
    await errorHandler(Melody, "message create event", err);
  }
};
