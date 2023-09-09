import { PrismaClient } from "@prisma/client";
import { Client, WebhookClient } from "discord.js";

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
  };
  db: PrismaClient;
  commands: Command[];
  cooldowns: {
    [userId: string]: number;
  };
  automod: {
    [userId: string]: number;
  };
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
  };
  ticketLogs: { [key: string]: string };
}
