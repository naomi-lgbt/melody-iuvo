import { execSync } from "child_process";

import { PrismaClient } from "@prisma/client";
import { ActivityType, Client, Events, GatewayIntentBits } from "discord.js";

import { EventToEmote } from "./config/Emotes";
import { Intents } from "./config/Intents";
import { autoModerationActionExecution } from "./events/autoModerationActionExecution";
import { clientReady } from "./events/clientReady";
import { interactionCreate } from "./events/interactionCreate";
import { messageCreate } from "./events/messageCreate";
import { voiceStateUpdate } from "./events/voiceStateUpdate";
import { ExtendedClient } from "./interfaces/ExtendedClient";
// import { assignRoles } from "./modules/assignRoles";
import { errorHandler } from "./utils/errorHandler";
import { loadCommands } from "./utils/loadCommands";
import { loadContexts } from "./utils/loadContexts";
import { validateEnv } from "./utils/validateEnv";

(async () => {
  try {
    /**
     * Initial setup.
     */
    const bot = new Client({
      intents: Intents
    }) as ExtendedClient;
    bot.env = validateEnv();

    /**
     * Fallthrough error handlers. These fire in rare cases where something throws
     * in a way that our standard catch block cannot see it.
     */
    process.on("unhandledRejection", async (error: Error) => {
      await errorHandler(bot, "Unhandled Rejection Error", error);
    });

    process.on("uncaughtException", async (error) => {
      await errorHandler(bot, "Uncaught Exception Error", error);
    });

    /**
     * Instantiate empty cache objects for later use.
     */
    bot.db = new PrismaClient();
    bot.cooldowns = {};
    bot.automod = {};
    bot.cache = {
      wordGame: {},
      slots: {},
      tarot: {}
    };
    bot.commit = execSync("git rev-parse HEAD").toString().trim();
    bot.ticketLogs = {};
    bot.jobs = [];
    bot.beanedUser = null;
    await loadCommands(bot);
    await loadContexts(bot);

    /**
     * Mount event handlers.
     */
    bot.on(Events.InteractionCreate, async (interaction) => {
      await interactionCreate(bot, interaction);
    });

    bot.on(Events.ClientReady, async () => {
      await clientReady(bot);
    });

    bot.on(Events.MessageCreate, async (message) => {
      await messageCreate(bot, message);
    });

    bot.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
      await bot.discord.channels.modLog?.send(
        `${EventToEmote.messageEdit} MESSAGE UPDATED: ${newMessage.author?.username} (${newMessage.author?.id})\n${oldMessage.content}\n${newMessage.content}`
      );
    });

    bot.on(Events.MessageDelete, async (message) => {
      await bot.discord.channels.modLog?.send(
        `${EventToEmote.messageDelete} MESSAGE DELETED: ${message.author?.username} (${message.author?.id})\n${message.content}`
      );
    });

    bot.on(Events.AutoModerationActionExecution, async (action) => {
      await autoModerationActionExecution(bot, action);
    });

    bot.on(Events.VoiceStateUpdate, async (oldState, newState) => {
      if (!oldState.channelId && newState.channelId) {
        await bot.discord.channels.modLog?.send(
          `${EventToEmote.voiceJoin} JOINED VOICE: ${newState.member?.user.username} (${newState.id}) - ${newState.channel?.name}`
        );
      }
      if (oldState.channelId && !newState.channelId) {
        await bot.discord.channels.modLog?.send(
          `${EventToEmote.voiceLeave} LEFT VOICE: ${newState.member?.user.username} (${newState.id}) - ${oldState.channel?.name}`
        );
      }
      await voiceStateUpdate(bot, oldState, newState);
    });

    bot.on(Events.ThreadCreate, async (thread) => {
      await thread.join();
      const owner = await thread.fetchOwner();
      await bot.discord.channels.modLog?.send(
        `${EventToEmote.threadCreate} THREAD CREATE: ${owner?.user?.username} (${owner?.id}) - ${thread.name}`
      );
    });

    bot.on(Events.ThreadDelete, async (thread) => {
      await bot.discord.channels.modLog?.send(
        `${EventToEmote.threadDelete} THREAD DELETE - ${thread.name}`
      );
    });

    bot.on(Events.ThreadUpdate, async (oldThread, newThread) => {
      if (!oldThread.archived && newThread.archived) {
        await bot.discord.channels.modLog?.send(
          `${EventToEmote.threadUpdate} THREAD ARCHIVED - ${newThread.name}`
        );
      }
      if (oldThread.archived && !newThread.archived) {
        await bot.discord.channels.modLog?.send(
          `${EventToEmote.threadUpdate} THREAD UNARCHIVED - ${newThread.name}`
        );
      }
      if (oldThread.name !== newThread.name) {
        await bot.discord.channels.modLog?.send(
          `${EventToEmote.threadUpdate} THREAD RENAMED - ${oldThread.name} ->${newThread.name}`
        );
      }
      if (!oldThread.locked && newThread.locked) {
        await bot.discord.channels.modLog?.send(
          `${EventToEmote.threadUpdate} THREAD LOCKED - ${newThread.name}`
        );
      }
      if (oldThread.locked && !newThread.locked) {
        await bot.discord.channels.modLog?.send(
          `${EventToEmote.threadUpdate} THREAD UNLOCKED - ${newThread.name}`
        );
      }
    });

    bot.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
      const oldRoles = oldMember.roles.cache.filter(
        (r) => !newMember.roles.cache.has(r.id)
      );
      const newRoles = newMember.roles.cache.filter(
        (r) => !oldMember.roles.cache.has(r.id)
      );
      for (const role of oldRoles.values()) {
        await bot.discord.channels.modLog?.send(
          `${EventToEmote.memberUpdate} ROLE REMOVED: ${newMember.user.username} (${newMember.id}) - ${role.name}`
        );
      }
      for (const role of newRoles.values()) {
        await bot.discord.channels.modLog?.send(
          `${EventToEmote.memberUpdate} ROLE ADDED: ${newMember.user.username} (${newMember.id}) - ${role.name}`
        );
      }

      if (oldMember.nickname !== newMember.nickname) {
        await bot.discord.channels.modLog?.send(
          `${EventToEmote.memberUpdate} NICKNAME CHANGED: ${newMember.user.username} (${newMember.id})\n${oldMember.nickname}\n${newMember.nickname}`
        );
      }

      const memRole = bot.discord.roles.member;
      if (
        !memRole ||
        // they already had acolyte role
        oldMember.roles.cache.has(memRole.id) ||
        // they do not currently have acolyte role
        !newMember.roles.cache.has(memRole.id)
      ) {
        return;
      }
      await bot.discord.channels.general?.send({
        content: `<a:love:1149580277220388985> <@!${newMember.id}>, welcome to our comfy corner! <a:love:1149580277220388985>`
      });
    });

    bot.on(Events.GuildMemberRemove, async (member) => {
      await bot.db.users
        .delete({
          where: {
            userId: member.id
          }
        })
        /**
         * Should only fail if the record doesn't exist. In which case,
         * we don't care that it failed because we wanted the record to not exist.
         */
        .catch(() => null);
      if (
        !bot.discord.roles.member ||
        !member.roles.cache.has(bot.discord.roles.member.id)
      ) {
        return;
      }
      await bot.discord.channels.general?.send({
        content: `<a:love:1149580277220388985> Good bye <@!${member.id}>, we will miss you! <a:love:1149580277220388985>`
      });
    });

    bot.on(Events.UserUpdate, async (oldUser, newUser) => {
      if (oldUser.username !== newUser.username) {
        await bot.discord.channels.modLog?.send(
          `${EventToEmote.memberUpdate} USERNAME CHANGED: ${newUser.username} (${newUser.id})\n${oldUser.username}\n${newUser.username}`
        );
      }

      if (oldUser.displayName !== newUser.displayName) {
        await bot.discord.channels.modLog?.send(
          `${EventToEmote.memberUpdate} DISPLAY NAME CHANGED: ${newUser.username} (${newUser.id})\n${oldUser.displayName}\n${newUser.displayName}`
        );
      }

      if (oldUser.avatarURL !== newUser.avatarURL) {
        await bot.discord.channels.modLog?.send(
          `${EventToEmote.memberUpdate} AVATAR CHANGED: ${newUser.username} (${newUser.id}) - ${newUser.displayAvatarURL()}`
        );
      }
    });

    /**
     * Connect to Discord.
     */
    await bot.login(bot.env.token);

    bot.user?.setActivity({
      name: "Custom Status",
      type: ActivityType.Custom,
      state: "I am Naomi's personal assistant."
    });
  } catch (err) {
    const bot = new Client({
      intents: [GatewayIntentBits.Guilds]
    }) as ExtendedClient;
    bot.env = validateEnv();
    await errorHandler(bot, "entry file", err);
  }
})();
