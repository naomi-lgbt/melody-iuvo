import { Plural } from "@prisma/client";
import {
  EmbedBuilder,
  MessageType,
  WebhookMessageCreateOptions
} from "discord.js";

import { ExtendedClient } from "../../interfaces/ExtendedClient";
import { GuildMessage } from "../../interfaces/GuildMessage";
import { errorHandler } from "../../utils/errorHandler";

/**
 * Sends a proxied message through the channel's webhook.
 * Creates the webhook if needed.
 *
 * @param {ExtendedClient} Melody The Melody's Discord instance.
 * @param {GuildMessage} message The message payload from Discord.
 * @param {Plural} identity The identity to proxy the message as.
 */
export const proxyPluralMessage = async (
  Melody: ExtendedClient,
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
      webhooks.find(
        (w) => w.owner && Melody.user && w.owner.id === Melody.user.id
      ) || (await channel.createWebhook({ name: "Melody's Plural System" }));

    const content: WebhookMessageCreateOptions = {
      content: message.content.startsWith(identity.prefix)
        ? message.content.replace(`${identity.prefix} `, "")
        : message.content,
      username: identity.name,
      avatarURL: identity.avatar,
      allowedMentions: {
        parse: []
      },
      embeds: []
    };

    if (message.type === MessageType.Reply && message?.reference?.messageId) {
      const originalMsg = await message.channel.messages.fetch(
        message.reference.messageId
      );

      content.content =
        (message.mentions.users.size ? `<@${originalMsg.author.id}>, ` : "") +
        `${content.content}`;
      content.allowedMentions = {
        users: [originalMsg.author.id]
      };

      content.embeds?.push(
        new EmbedBuilder()
          .setDescription(originalMsg.content)
          .setAuthor({
            name: originalMsg.author.username,
            iconURL: originalMsg.author.displayAvatarURL(),
            url: originalMsg.url
          })
          .setURL(originalMsg.url)
      );
    }
    await webhook.send(content);
    await message.delete();

    await Melody.env.pluralLogHook.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Message proxied.")
          .setDescription(message.content.slice(0, 4000))
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL()
          })
      ]
    });
  } catch (err) {
    await errorHandler(Melody, "proxy plural message", err);
  }
};
