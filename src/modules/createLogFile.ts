import { writeFile } from "fs/promises";
import { join } from "path";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";

/**
 * Creates the initial ticket log file.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {string} channelId The ticket channel ID, used as a unique identifier.
 * @param {string} user The user tag of the person who opened the ticket.
 * @param {string} content The initial content of the log file.
 */
export const createLogFile = async (
  bot: ExtendedClient,
  channelId: string,
  user: string,
  content: string
): Promise<void> => {
  try {
    bot.ticketLogs[channelId] = channelId;

    await writeFile(
      join(process.cwd(), "logs", `${channelId}.txt`),
      `[${new Date().toLocaleString()}] - **TICKET CREATED**\n[${new Date().toLocaleString()}] - ${user}: ${content}\n`
    );
  } catch (err) {
    await errorHandler(bot, "log file creation", err);
  }
};
