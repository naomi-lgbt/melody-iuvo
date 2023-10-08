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

import { handleCurrencyAward } from "../../../../src/modules/subcommands/currency/handleCurrencyAward";
import { Database } from "../../../__mocks__/Database.mock";

const db = new Database();
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

suite("handleCurrencyAward", () => {
  test("should not allow non-naomi users to award currency", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "currency",
      subcommandName: "award",
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
          name: "amount",
          value: 100,
          type: ApplicationCommandOptionType.Number,
        },
      ],
    });
    await command.deferReply({ ephemeral: true });
    await handleCurrencyAward(
      { ...bot, env: { debugHook } } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    assert.equal(
      command.replies[0]?.content,
      "Only my Mama may use this command."
    );
    assert.isTrue(command.ephemeral);
  });

  test("should not allow awards when user is playing word game", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "currency",
      subcommandName: "award",
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
          name: "amount",
          value: 100,
          type: ApplicationCommandOptionType.Number,
        },
      ],
    });
    const cache = {
      wordGame: { [user.id]: true },
    };
    await command.deferReply({ ephemeral: true });
    await handleCurrencyAward(
      { ...bot, env: { debugHook }, db, cache } as never,
      command.typeCast()
    );
    assert.strictEqual(
      command.replies[0]?.content,
      "It would seem they are currently in the middle of a game. Best not to disturb them, Mama."
    );
  });

  test("should not allow negative currency", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "currency",
      subcommandName: "award",
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
          name: "amount",
          value: -100,
          type: ApplicationCommandOptionType.Number,
        },
      ],
    });
    await command.deferReply({ ephemeral: true });
    await handleCurrencyAward(
      { ...bot, env: { debugHook }, db, cache: { wordGame: {} } } as never,
      command.typeCast()
    );
    assert.strictEqual(
      command.replies[0]?.content,
      "You can't take away more NaomiCoin than the user has!"
    );
  });

  test("should allow naomi to award currency", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "currency",
      subcommandName: "award",
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
          name: "amount",
          value: 100,
          type: ApplicationCommandOptionType.Number,
        },
      ],
    });
    await command.deferReply({ ephemeral: true });
    await handleCurrencyAward(
      { ...bot, env: { debugHook }, db, cache: { wordGame: {} } } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    assert.equal(
      command.replies[0]?.content,
      `You have awarded 100 NaomiCoin to <@${user.id}>! Their new total is 100 NaomiCoin.`
    );
    assert.isTrue(command.ephemeral);
  });
});
