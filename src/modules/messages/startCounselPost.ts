import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

import { ExtendedClient } from "../../interfaces/ExtendedClient";
import { GuildMessage } from "../../interfaces/GuildMessage";
import { errorHandler } from "../../utils/errorHandler";

/**
 * Handles the logic to start the post in the Counsel channel.
 *
 * @param {ExtendedClient} Melody The Melody's Discord instance.
 * @param {GuildMessage} message The message payload from Discord.
 */
export const startCounselPost = async (
  Melody: ExtendedClient,
  message: GuildMessage
) => {
  try {
    const content = `# Need some assistance?

First, what kind of assistance do you need? If you need some comfort or reassurance, click "Comfort". If you need help with one of our projects, click "Support".

- The comfort system allows you to request comfort from Mama Naomi. Clicking the button will create a private thread where you can get guidance or reassurance from her. Please note that we are not mental health professionals. For serious issues, we encourage you to seek the support that you need. This system is only for basic pick-me-ups and love. All conversations in these threads must still comply with our Code of Conduct and Discord's Terms of Service.
- The support system allows you to speak with our staff team privately. Clicking the button will create a private thread where you can ask your question regarding our project. Please note that tickets opened for general chatter will be closed, and users will be actioned.`;

    const comfort = new ButtonBuilder()
      .setLabel("Comfort")
      .setEmoji("<a:love:1149580277220388985>")
      .setStyle(ButtonStyle.Primary)
      .setCustomId("comfort");
    const ticket = new ButtonBuilder()
      .setLabel("Support")
      .setEmoji("❔")
      .setStyle(ButtonStyle.Primary)
      .setCustomId("ticket");

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      comfort,
      ticket
    );
    await message.channel.send({ content, components: [row] });
  } catch (err) {
    await errorHandler(Melody, "start comfort post", err);
    await message.reply({
      content:
        "Forgive me, but I failed to complete your request. Please try again later."
    });
  }
};
