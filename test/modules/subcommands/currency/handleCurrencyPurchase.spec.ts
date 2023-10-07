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

import { CurrencyItems } from "../../../../src/config/Currency";
import { makeChange } from "../../../../src/modules/makeChange";
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
          value: CurrencyItems[0].internalId,
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
      `It would seem you don't have enough NaomiCoin to purchase a **${
        CurrencyItems[0].name
      }**!\nYou have 0 NaomiCoin, and need ${CurrencyItems[0].price.toLocaleString()}.`
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
          value: CurrencyItems[0].internalId,
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
          value: CurrencyItems[0].internalId,
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
        currency: makeChange(CurrencyItems[0].price),
      },
      update: {
        currency: makeChange(CurrencyItems[0].price),
      },
    });
    await handleCurrencyPurchase(
      { ...bot, env: { debugHook }, db, cache: { wordGame: {} } } as never,
      command.typeCast()
    );
    assert.strictEqual(
      command.replies[0]?.content,
      `It is my pleasure to present you with a **${CurrencyItems[0].name}**!\nYou now have 0 NaomiCoin.`
    );
  });
});
