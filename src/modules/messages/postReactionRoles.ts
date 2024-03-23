import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Message
} from "discord.js";

import { ExtendedClient } from "../../interfaces/ExtendedClient";
import { errorHandler } from "../../utils/errorHandler";

/**
 * Generates a message with buttons for users to click to get a role.
 *
 * @param {ExtendedClient} Melody The Melody's Discord instance.
 * @param {Message} message The message payload from Discord.
 */
export const postReactionRoles = async (
  Melody: ExtendedClient,
  message: Message
) => {
  try {
    const rolesToAdd = [...message.mentions.roles.values()];
    if (rolesToAdd.length > 5 || rolesToAdd.length < 1) {
      return;
    }
    const buttons = rolesToAdd.map((role) =>
      new ButtonBuilder()
        .setCustomId(`role-${role.id}`)
        .setLabel(role.name)
        .setStyle(ButtonStyle.Primary)
    );
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);
    await message.channel.send({
      content: "Hello friends~! Click these buttons to get a role.",
      components: [row]
    });
    await message.delete();
  } catch (err) {
    await errorHandler(Melody, "post reaction roles", err);
  }
};
