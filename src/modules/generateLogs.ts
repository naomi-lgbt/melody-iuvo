import { readFile, unlink } from "fs/promises";
import { join } from "path";

import { AttachmentBuilder } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";

/**
 * To run when a ticket is closed. Finds the ticket log file,
 * creates a message attachement with the logs, and deletes the file.
 *
 * @param {ExtendedClient} Melody The Melody's Discord instance.
 * @param {string} channelId The channel ID of the ticket.
 * @returns {Promise<AttachmentBuilder>} The log file as a Discord attachment.
 */
export const generateLogs = async (
  Melody: ExtendedClient,
  channelId: string
): Promise<AttachmentBuilder> => {
  try {
    delete Melody.ticketLogs[channelId];

    const logs = await readFile(
      join(process.cwd(), "logs", `${channelId}.txt`),
      "utf8"
    ).catch(() => "no logs found...");

    const attachment = new AttachmentBuilder(Buffer.from(logs, "utf-8"), {
      name: "log.txt"
    });

    await unlink(join(process.cwd(), "logs", `${channelId}.txt`)).catch(
      () => null
    );

    return attachment;
  } catch (err) {
    await errorHandler(Melody, "log generator", err);
    return new AttachmentBuilder(
      Buffer.from("An error occurred fetching these logs.", "utf-8"),
      { name: "log.txt" }
    );
  }
};
