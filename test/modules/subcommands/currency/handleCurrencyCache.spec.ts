import { assert } from "chai";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import {
  MockChannel,
  MockChatInputCommandInteraction,
  MockGuild,
  MockMember,
  MockUser,
  MockWebhook,
} from "discordjs-testing";

import { handleCurrencyCache } from "../../../../src/modules/subcommands/currency/handleCurrencyCache";

const guild = new MockGuild({
  name: "Test Guild",
});
const bot = new MockUser({
  username: "Test Bot",
  avatar: "test",
  discriminator: 1234,
  bot: true,
  system: false,
});
const user = new MockUser({
  username: "Test User",
  avatar: "test",
  discriminator: 1234,
  bot: false,
  system: false,
});
const naomi = new MockUser({
  username: "Naomi",
  avatar: "test",
  discriminator: 1234,
  bot: false,
  system: false,
});
// @ts-expect-error Need to manually set ID for owner only command.
naomi._id = "465650873650118659";
const member = new MockMember({
  guild,
  user,
});
const channel = new MockChannel({
  name: "test-channel",
  guild,
  type: ChannelType.GuildText,
});
const debugHook = new MockWebhook({
  channel,
  user: bot,
});

suite("handleCurrencyCache", () => {
  test("should not allow non-naomi users to bust the cache", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "currency",
      subcommandName: "cache",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "target",
          value: user,
          type: ApplicationCommandOptionType.User,
        },
        {
          name: "prop",
          value: "wordGame",
          type: ApplicationCommandOptionType.String,
        },
      ],
    });
    await command.deferReply({ ephemeral: true });
    await handleCurrencyCache(
      { ...bot, env: { debugHook } } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    assert.equal(
      command.replies[0]?.content,
      "Only my Mistress may use this command."
    );
  });

  test("should bust the wordGame cache", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "currency",
      subcommandName: "cache",
      guild,
      bot,
      user: naomi,
      member,
      channel,
      options: [
        {
          name: "target",
          value: user,
          type: ApplicationCommandOptionType.User,
        },
        {
          name: "prop",
          value: "wordGame",
          type: ApplicationCommandOptionType.String,
        },
      ],
    });
    const cache = {
      wordGame: {
        [user.id]: true,
      },
      slots: {
        [user.id]: true,
      },
    };
    await command.deferReply({ ephemeral: true });
    await handleCurrencyCache(
      { ...bot, env: { debugHook }, cache } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    assert.equal(
      command.replies[0]?.content,
      "Cleared Test User's wordGame cache!"
    );
    assert.notExists(cache.wordGame[user.id]);
    assert.isTrue(cache.slots[user.id]);
  });

  test("should bust the slots cache", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "currency",
      subcommandName: "cache",
      guild,
      bot,
      user: naomi,
      member,
      channel,
      options: [
        {
          name: "target",
          value: user,
          type: ApplicationCommandOptionType.User,
        },
        {
          name: "prop",
          value: "slots",
          type: ApplicationCommandOptionType.String,
        },
      ],
    });
    const cache = {
      wordGame: {
        [user.id]: true,
      },
      slots: {
        [user.id]: true,
      },
    };
    await command.deferReply({ ephemeral: true });
    await handleCurrencyCache(
      { ...bot, env: { debugHook }, cache } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    assert.equal(
      command.replies[0]?.content,
      "Cleared Test User's slots cache!"
    );
    assert.notExists(cache.slots[user.id]);
    assert.isTrue(cache.wordGame[user.id]);
  });
});
