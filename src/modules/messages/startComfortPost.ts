import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

import { ExtendedClient } from "../../interfaces/ExtendedClient";
import { GuildMessage } from "../../interfaces/GuildMessage";
import { errorHandler } from "../../utils/errorHandler";

/**
 * Handles the logic to start a comfort post.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {GuildMessage} message The message payload from Discord.
 */
export const startComfortPost = async (
  bot: ExtendedClient,
  message: GuildMessage
) => {
  try {
    const content = `# Need Comfort?

This system allows you to request comfort from Mama Naomi. Clicking the button below will create a private thread where you can get guidance or reassurance from her.

Please note that we are not mental health professionals. For serious issues, we encourage you to seek the support that you need. This system is only for basic pick-me-ups and love.

All conversations in these threads must still comply with our Code of Conduct and Discord's Terms of Service.`;

    const button = new ButtonBuilder()
      .setLabel("Get some comfort")
      .setEmoji("<a:love:1149580277220388985>")
      .setStyle(ButtonStyle.Primary)
      .setCustomId("comfort");

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
    await message.channel.send({ content, components: [row] });
  } catch (err) {
    await errorHandler(bot, "start comfort post", err);
    await message.reply({
      content:
        "Forgive me, but I failed to complete your request. Please try again later.",
    });
  }
};
