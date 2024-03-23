import { EmbedBuilder } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";

/**
 * Formats an error and sends it to the debug hook.
 *
 * @param {ExtendedClient} Melody The Melody's Discord instance.
 * @param {string} context A description of where in the code the error occurred.
 * @param {unknown} error The Node.js Error.
 */
export const errorHandler = async (
  Melody: ExtendedClient,
  context: string,
  error: unknown
) => {
  // typecast
  const err = error as Error;
  const embed = new EmbedBuilder();
  embed.setTitle(`Error in \`${context}\`!`);
  embed.setDescription(
    `\`\`\`${err.stack || "No stack trace available."}\`\`\``
  );
  embed.addFields([
    {
      name: "Message",
      value: err.message || "No message available."
    }
  ]);
  await Melody.env.debugHook.send({
    embeds: [embed],
    username: Melody.user?.username ?? "Melody",
    avatarURL:
      Melody.user?.displayAvatarURL() ??
      "https://cdn.nhcarrigan.com/avatars/nhcarrigan.png"
  });
};
