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

import { handleCurrencyPurchase } from "../../../../src/modules/subcommands/currency/handleCurrencyPurchase";
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

suite("handleCurrencyPurchase", () => {
  test("should not allow a purchase with insufficient funds", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "currency",
      subcommandName: "purchase",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "target",
          value: "bio-slot",
          type: ApplicationCommandOptionType.String,
        },
      ],
    });
    await command.deferReply({ ephemeral: true });
    await handleCurrencyPurchase(
      { ...bot, env: { debugHook }, db, cache: { wordGame: {} } } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    assert.equal(
      command.replies[0]?.content,
      "It would seem you don't have enough NaomiCoin to purchase a **Slot in Bio**!\nYou have 0 NaomiCoin, and need 53,921."
    );
    assert.isTrue(command.ephemeral);
  });

  test("should correctly handle invalid items", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "currency",
      subcommandName: "purchase",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "target",
          value: "asd;fjasdk;f",
          type: ApplicationCommandOptionType.String,
        },
      ],
    });
    await command.deferReply({ ephemeral: true });
    await handleCurrencyPurchase(
      { ...bot, env: { debugHook }, db, cache: { wordGame: {} } } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    assert.equal(
      command.replies[0]?.content,
      "Forgive me, but I was unable to locate that item."
    );
    assert.isTrue(command.ephemeral);
  });

  test("should not allow purchase when user is playing word game", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "currency",
      subcommandName: "purchase",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "target",
          value: "bio-slot",
          type: ApplicationCommandOptionType.String,
        },
      ],
    });
    const cache = {
      wordGame: { [user.id]: true },
    };
    await command.deferReply({ ephemeral: true });
    await handleCurrencyPurchase(
      { ...bot, env: { debugHook }, db, cache } as never,
      command.typeCast()
    );
    assert.strictEqual(
      command.replies[0]?.content,
      "It would seem you are still playing a word game. Please complete that first, before making any purchases."
    );
  });

  test("should allow purchase with enough currency", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "currency",
      subcommandName: "purchase",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "target",
          value: "bio-slot",
          type: ApplicationCommandOptionType.String,
        },
      ],
    });
    await command.deferReply({ ephemeral: true });
    await db.users.upsert({
      where: {
        userId: user.id,
      },
      create: {
        userId: user.id,
        currency: {
          copper: 21,
          silver: 39,
          gold: 5,
          platinum: 0,
          amethyst: 0,
        },
      },
      update: {
        currency: {
          copper: 21,
          silver: 39,
          gold: 5,
          platinum: 0,
          amethyst: 0,
        },
      },
    });
    await handleCurrencyPurchase(
      { ...bot, env: { debugHook }, db, cache: { wordGame: {} } } as never,
      command.typeCast()
    );
    assert.strictEqual(
      command.replies[0]?.content,
      "It is my pleasure to present you with a **Slot in Bio**!\nYou now have 0 NaomiCoin."
    );
  });
});
