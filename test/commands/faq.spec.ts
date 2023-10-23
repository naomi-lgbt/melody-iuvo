import { assert } from "chai";
import {
  ApplicationCommandOptionType,
  ChannelType,
  EmbedBuilder
} from "discord.js";
import {
  MockChannel,
  MockChatInputCommandInteraction,
  MockGuild,
  MockMember,
  MockUser,
  MockWebhook
} from "discordjs-testing";

import { faq } from "../../src/commands/faq";

const guild = new MockGuild({
  name: "Test Guild"
});
const bot = new MockUser({
  username: "Test Bot",
  avatar: "test",
  discriminator: 1234,
  bot: true,
  system: false
});
const user = new MockUser({
  username: "Test User",
  avatar: "test",
  discriminator: 1234,
  bot: false,
  system: false
});
const member = new MockMember({
  guild,
  user
});
const channel = new MockChannel({
  name: "test-channel",
  guild,
  type: ChannelType.GuildText
});
const debugHook = new MockWebhook({
  channel,
  user: bot
});

suite("Faq command", () => {
  test("Should handle an invalid target", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "faq",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "question",
          value: "a;sdlfkjafsdl;kj",
          type: ApplicationCommandOptionType.String
        }
      ]
    });
    await faq.run({ ...bot, env: { debugHook } } as never, command.typeCast());
    assert.equal(command.replies.length, 1);
    assert.deepEqual(
      command.replies[0]?.content,
      "I am so sorry, but I do not seem to have that question in my records."
    );
  });

  test("Should handle a valid target", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "faq",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "question",
          value: "How do I get Naomi to do work for me?",
          type: ApplicationCommandOptionType.String
        }
      ]
    });
    await faq.run({ ...bot, env: { debugHook } } as never, command.typeCast());
    assert.equal(command.replies.length, 1);
    const embed = command.replies[0]?.embeds?.[0] as EmbedBuilder;
    assert.strictEqual(
      embed.toJSON().title,
      "How do I get Naomi to do work for me?"
    );
    assert.strictEqual(
      embed.toJSON().description,
      "There are a couple of forms linked in <#1131640463787577435>. Fill out the appropriate form, and we'll create a thread for you to discuss your needs further."
    );
  });
});
