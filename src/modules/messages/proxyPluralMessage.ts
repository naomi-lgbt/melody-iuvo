import { Plural } from "@prisma/client";
import { EmbedBuilder } from "discord.js";

import { ExtendedClient } from "../../interfaces/ExtendedClient";
import { GuildMessage } from "../../interfaces/GuildMessage";
import { errorHandler } from "../../utils/errorHandler";

/**
 * Sends a proxied message through the channel's webhook.
 * Creates the webhook if needed.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {GuildMessage} message The message payload from Discord.
 * @param {Plural} identity The identity to proxy the message as.
 */
export const proxyPluralMessage = async (
  bot: ExtendedClient,
  message: GuildMessage,
  identity: Plural
) => {
  try {
    const { channel } = message;
    if (channel.isDMBased() || !channel.isTextBased() || channel.isThread()) {
      return;
    }
    const webhooks = await channel.fetchWebhooks();
    const webhook =
      webhooks.find((w) => w.owner && bot.user && w.owner.id === bot.user.id) ||
      (await channel.createWebhook({ name: "Melody's Plural System" }));

    await webhook.send({
      content: message.content.startsWith(identity.prefix)
        ? message.content.replace(identity.prefix, "")
        : message.content,
      username: identity.name,
      avatarURL: identity.avatar,
      allowedMentions: {
        parse: [],
      },
    });
    await message.delete();

    await bot.env.pluralLogHook.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Message proxied.")
          .setDescription(message.content.slice(0, 4000))
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL(),
          }),
      ],
    });
  } catch (err) {
    await errorHandler(bot, "proxy plural message", err);
  }
};
