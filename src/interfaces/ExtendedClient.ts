import { PrismaClient } from "@prisma/client";
import { Client, Message, Role, TextChannel, WebhookClient } from "discord.js";

import { Command } from "./Command";
import { Context } from "./Context";
import { SteamGame } from "./Steam";

export interface ExtendedClient extends Client {
  env: {
    token: string;
    homeGuild: string;
    debugHook: WebhookClient;
    ticketLogHook: WebhookClient;
    pluralLogHook: WebhookClient;
  };
  commit: string;
  db: PrismaClient;
  general: TextChannel;
  contributing: TextChannel;
  vent: TextChannel;
  regular: Role;
  partner: Role;
  donor: Role;
  staff: Role;
  commands: Command[];
  contexts: Context[];
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
  games: SteamGame[];
  beanedUser: string | null;
}
