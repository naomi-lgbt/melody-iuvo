import { PrismaClient } from "@prisma/client";
import { Client, Message, WebhookClient } from "discord.js";

import { Command } from "./Command";

export interface ExtendedClient extends Client {
  env: {
    token: string;
    homeGuild: string;
    debugHook: WebhookClient;
    ticketLogHook: WebhookClient;
    pluralLogHook: WebhookClient;
    birthdayHook: WebhookClient;
    issuesHook: WebhookClient;
    ventChannel: string;
  };
  db: PrismaClient;
  commands: Command[];
  cooldowns: {
    [userId: string]: number;
  };
  automod: {
    [userId: string]: number;
  };
  twitchNotif: Message | undefined;
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
}
