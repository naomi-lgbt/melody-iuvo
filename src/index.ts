import { execSync } from "child_process";

import { PrismaClient } from "@prisma/client";
import {
  ActivityType,
  AuditLogEvent,
  Client,
  Events,
  GatewayIntentBits,
  User
} from "discord.js";

import { ActionToEmote, EventToEmote } from "./config/Emotes";
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
    const Melody = new Client({
      intents: Intents
    }) as ExtendedClient;
    Melody.env = validateEnv();

    /**
     * Fallthrough error handlers. These fire in rare cases where something throws
     * in a way that our standard catch block cannot see it.
     */
    process.on("unhandledRejection", async (error: Error) => {
      await errorHandler(Melody, "Unhandled Rejection Error", error);
    });

    process.on("uncaughtException", async (error) => {
      await errorHandler(Melody, "Uncaught Exception Error", error);
    });

    /**
     * Instantiate empty cache objects for later use.
     */
    Melody.db = new PrismaClient();
    Melody.cooldowns = {};
    Melody.automod = {};
    Melody.cache = {
      wordGame: {},
      slots: {},
      tarot: {}
    };
    Melody.commit = execSync("git rev-parse HEAD").toString().trim();
    Melody.ticketLogs = {};
    Melody.jobs = [];
    Melody.beanedUser = null;
    await loadCommands(Melody);
    await loadContexts(Melody);

    /**
     * Mount event handlers.
     */
    Melody.on(Events.InteractionCreate, async (interaction) => {
      await interactionCreate(Melody, interaction);
    });

    Melody.on(Events.ClientReady, async () => {
      await clientReady(Melody);
    });

    Melody.on(Events.MessageCreate, async (message) => {
      await messageCreate(Melody, message);
    });

    Melody.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
      if (oldMessage.content === newMessage.content) {
        return;
      }
      await Melody.discord.channels.modLog?.send(
        `${EventToEmote.messageEdit} MESSAGE UPDATED: ${newMessage.author?.username} (${newMessage.author?.id})\n${oldMessage.content}\n${newMessage.content}`
      );
    });

    Melody.on(Events.MessageDelete, async (message) => {
      await Melody.discord.channels.modLog?.send(
        `${EventToEmote.messageDelete} MESSAGE DELETED: ${message.author?.username} (${message.author?.id})\n${message.content}`
      );
    });

    Melody.on(Events.AutoModerationActionExecution, async (action) => {
      await autoModerationActionExecution(Melody, action);
    });

    Melody.on(Events.VoiceStateUpdate, async (oldState, newState) => {
      if (!oldState.channelId && newState.channelId) {
        await Melody.discord.channels.modLog?.send(
          `${EventToEmote.voiceJoin} JOINED VOICE: ${newState.member?.user.username} (${newState.id}) - ${newState.channel?.name}`
        );
      }
      if (oldState.channelId && !newState.channelId) {
        await Melody.discord.channels.modLog?.send(
          `${EventToEmote.voiceLeave} LEFT VOICE: ${newState.member?.user.username} (${newState.id}) - ${oldState.channel?.name}`
        );
      }
      await voiceStateUpdate(Melody, oldState, newState);
    });

    Melody.on(Events.ThreadCreate, async (thread) => {
      await thread.join();
      const owner = await thread.fetchOwner();
      await Melody.discord.channels.modLog?.send(
        `${EventToEmote.threadCreate} THREAD CREATE: ${owner?.user?.username} (${owner?.id}) - ${thread.name}`
      );
    });

    Melody.on(Events.ThreadDelete, async (thread) => {
      await Melody.discord.channels.modLog?.send(
        `${EventToEmote.threadDelete} THREAD DELETE - ${thread.name}`
      );
    });

    Melody.on(Events.ThreadUpdate, async (oldThread, newThread) => {
      if (!oldThread.archived && newThread.archived) {
        await Melody.discord.channels.modLog?.send(
          `${EventToEmote.threadUpdate} THREAD ARCHIVED - ${newThread.name}`
        );
      }
      if (oldThread.archived && !newThread.archived) {
        await Melody.discord.channels.modLog?.send(
          `${EventToEmote.threadUpdate} THREAD UNARCHIVED - ${newThread.name}`
        );
      }
      if (oldThread.name !== newThread.name) {
        await Melody.discord.channels.modLog?.send(
          `${EventToEmote.threadUpdate} THREAD RENAMED - ${oldThread.name} ->${newThread.name}`
        );
      }
      if (!oldThread.locked && newThread.locked) {
        await Melody.discord.channels.modLog?.send(
          `${EventToEmote.threadUpdate} THREAD LOCKED - ${newThread.name}`
        );
      }
      if (oldThread.locked && !newThread.locked) {
        await Melody.discord.channels.modLog?.send(
          `${EventToEmote.threadUpdate} THREAD UNLOCKED - ${newThread.name}`
        );
      }
    });

    Melody.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
      const oldRoles = oldMember.roles.cache.filter(
        (r) => !newMember.roles.cache.has(r.id)
      );
      const newRoles = newMember.roles.cache.filter(
        (r) => !oldMember.roles.cache.has(r.id)
      );
      for (const role of oldRoles.values()) {
        await Melody.discord.channels.modLog?.send(
          `${EventToEmote.memberUpdate} ROLE REMOVED: ${newMember.user.username} (${newMember.id}) - ${role.name}`
        );
      }
      for (const role of newRoles.values()) {
        await Melody.discord.channels.modLog?.send(
          `${EventToEmote.memberUpdate} ROLE ADDED: ${newMember.user.username} (${newMember.id}) - ${role.name}`
        );
      }

      if (oldMember.nickname !== newMember.nickname) {
        await Melody.discord.channels.modLog?.send(
          `${EventToEmote.memberUpdate} NICKNAME CHANGED: ${newMember.user.username} (${newMember.id})\n${oldMember.nickname}\n${newMember.nickname}`
        );
      }

      const memRole = Melody.discord.roles.member;
      if (
        !memRole ||
        // they already had acolyte role
        oldMember.roles.cache.has(memRole.id) ||
        // they do not currently have acolyte role
        !newMember.roles.cache.has(memRole.id)
      ) {
        return;
      }
      await Melody.discord.channels.general?.send({
        content: `<a:love:1149580277220388985> <@!${newMember.id}>, welcome to our comfy corner! <a:love:1149580277220388985>`
      });
    });

    Melody.on(Events.GuildMemberRemove, async (member) => {
      await Melody.db.users
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
        !Melody.discord.roles.member ||
        !member.roles.cache.has(Melody.discord.roles.member.id)
      ) {
        return;
      }
      await Melody.discord.channels.general?.send({
        content: `<a:love:1149580277220388985> Good bye <@!${member.id}>, we will miss you! <a:love:1149580277220388985>`
      });
    });

    Melody.on(Events.UserUpdate, async (oldUser, newUser) => {
      if (oldUser.username !== newUser.username) {
        await Melody.discord.channels.modLog?.send(
          `${EventToEmote.memberUpdate} USERNAME CHANGED: ${newUser.username} (${newUser.id})\n${oldUser.username}\n${newUser.username}`
        );
      }

      if (oldUser.displayName !== newUser.displayName) {
        await Melody.discord.channels.modLog?.send(
          `${EventToEmote.memberUpdate} DISPLAY NAME CHANGED: ${newUser.username} (${newUser.id})\n${oldUser.displayName}\n${newUser.displayName}`
        );
      }

      if (oldUser.avatarURL !== newUser.avatarURL) {
        await Melody.discord.channels.modLog?.send(
          `${EventToEmote.memberUpdate} AVATAR CHANGED: ${newUser.username} (${newUser.id}) - ${newUser.displayAvatarURL()}`
        );
      }
    });

    Melody.on(Events.GuildAuditLogEntryCreate, async (log) => {
      const { action, changes, executorId, targetId, target, reason } = log;

      // These are essential :3
      if (!targetId || !executorId) {
        return;
      }

      if (executorId === Melody.user?.id) {
        return;
      }

      // Mod stuff needs target to be a User.
      if (!(target instanceof User)) {
        return;
      }

      if (action === AuditLogEvent.MemberUpdate) {
        const timeout = changes.find(
          (c) => c.key === "communication_disabled_until"
        );
        if (timeout?.new) {
          await Melody.discord.channels.publicModLog?.send(
            `${ActionToEmote.mute} **MUTE**: ${target.username} (${target.id} - ${reason})`
          );
          return;
        }
        if (timeout?.old) {
          await Melody.discord.channels.publicModLog?.send(
            `${ActionToEmote.unmute} **UNMUTE**: ${target.username} (${target.id} - ${reason})`
          );
          return;
        }
      }

      switch (action) {
        case AuditLogEvent.MemberBanAdd:
          await Melody.discord.channels.publicModLog?.send(
            `${ActionToEmote.ban} BAN: ${target.username} (${target.id} - ${reason})`
          );
          break;
        case AuditLogEvent.MemberBanRemove:
          await Melody.discord.channels.publicModLog?.send(
            `${EventToEmote.unban} **UNBAN**: ${target.username} (${target.id} - ${reason})`
          );
          break;
        case AuditLogEvent.MemberKick:
          await Melody.discord.channels.publicModLog?.send(
            `${ActionToEmote.mute} **KICK**: ${target.username} (${target.id} - ${reason})`
          );
          break;
      }
    });

    /**
     * Connect to Discord.
     */
    await Melody.login(Melody.env.token);

    Melody.user?.setActivity({
      name: "Custom Status",
      type: ActivityType.Custom,
      state: "I am Naomi's personal assistant."
    });
  } catch (err) {
    const Melody = new Client({
      intents: [GatewayIntentBits.Guilds]
    }) as ExtendedClient;
    Melody.env = validateEnv();
    await errorHandler(Melody, "entry file", err);
  }
})();
