import { assert } from "chai";
import {
  ApplicationCommandOptionType,
  ChannelType,
  EmbedBuilder,
} from "discord.js";
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
import { parseCurrencyString } from "../../../../src/modules/parseCurrencyString";
import { handleCurrencyItem } from "../../../../src/modules/subcommands/currency/handleCurrencyItem";

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

suite("handleCurrencyItem", () => {
  test("should display an item correctly", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "currency",
      subcommandName: "item",
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
    await handleCurrencyItem(
      { ...bot, env: { debugHook } } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    const embed = command.replies[0]?.embeds?.[0] as EmbedBuilder;
    assert.equal(embed?.toJSON().title, CurrencyItems[0].name);
    assert.equal(embed?.toJSON().description, CurrencyItems[0].description);
    assert.deepEqual(embed?.toJSON().fields, [
      {
        name: `${CurrencyItems[0].price.toLocaleString()} NaomiCoin`,
        value: parseCurrencyString(makeChange(CurrencyItems[0].price)),
      },
    ]);
  });

  test("should handle an invalid item", async () => {
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
          value: ";aldsfkjasd;lkfj",
          type: ApplicationCommandOptionType.String,
        },
      ],
    });

    await command.deferReply({ ephemeral: true });
    await handleCurrencyItem(
      { ...bot, env: { debugHook } } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    assert.equal(
      command.replies[0]?.content,
      "Forgive me, but I was unable to locate that item."
    );
  });
});
