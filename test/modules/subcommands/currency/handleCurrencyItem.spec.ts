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
          value: "bio-slot",
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
    assert.equal(embed?.toJSON().title, "Slot in Bio");
    assert.equal(
      embed?.toJSON().description,
      "Naomi's personal account has a space in her bio for a special person. You can become that special person, until someone buys this again and takes the slot from you."
    );
    assert.deepEqual(embed?.toJSON().fields, [
      {
        name: "53,921 NaomiCoin",
        value:
          "<:naomicopper:1146242994475900938>: 21\n<:naomisilver:1146242999471321159>: 39\n<:naomigold:1146242995893583973>: 5\n<:naomiplatinum:1146242997252530246>: 0\n<:naomiamethyst:1146242992315826206>: 0",
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
