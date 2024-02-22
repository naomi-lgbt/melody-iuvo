import { PrismaClient } from "@prisma/client";
import {
  Client,
  Guild,
  Message,
  Role,
  GuildTextBasedChannel,
  WebhookClient
} from "discord.js";
import { Job } from "node-schedule";

import { Command } from "./Command";
import { Context } from "./Context";

export interface ExtendedClient extends Client {
  env: {
    token: string;
    homeGuild: string;
    debugHook: WebhookClient;
    ticketLogHook: WebhookClient;
    pluralLogHook: WebhookClient;
  };
  discord: {
    guild: Guild | null;
    channels: {
      general: GuildTextBasedChannel | null;
      contributing: GuildTextBasedChannel | null;
      vent: GuildTextBasedChannel | null;
      partners: GuildTextBasedChannel | null;
      training: GuildTextBasedChannel | null;
    };
    roles: {
      regular: Role | null;
      partner: Role | null;
      friend: Role | null;
      donor: Role | null;
      staff: Role | null;
      mentee: Role | null;
      awakened: Role | null;
    };
  };
  commit: string;
  db: PrismaClient;
  commands: Command[];
  contexts: Context[];
  cooldowns: {
    [userId: string]: number;
  };
  automod: {
    [userId: string]: number;
  };
  twitchNotif: Message | undefined;
  jobs: Job[];
  cache: {
    slots: {
      [userId: string]: {
        lastPlayed: number;
      };
    };
    wordGame: {
      [userId: string]: {
        wager: number;
        guesses: string[];
        target: string;
        balance: number;
      };
    };
    tarot: {
      [userId: string]: {
        lastPlayed: number;
      };
    };
  };
  ticketLogs: { [key: string]: string };
  beanedUser: string | null;
}
