import { assert } from "chai";
import { ChannelType, EmbedBuilder } from "discord.js";
import {
  MockChannel,
  MockChatInputCommandInteraction,
  MockGuild,
  MockMember,
  MockUser,
  MockWebhook,
} from "discordjs-testing";

import { handleCurrencyAbout } from "../../../../src/modules/subcommands/currency/handleCurrencyAbout";

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
suite("handleCurrencyAbout", () => {
  test("should return the correct embed", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "currency",
      subcommandName: "about",
      guild,
      bot,
      user,
      member,
      channel,
    });
    await command.deferReply();
    await handleCurrencyAbout(
      { ...bot, env: { debugHook } } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    const embed = command.replies[0]?.embeds?.[0] as EmbedBuilder;
    assert.equal(embed.toJSON().title, "NaomiCoin");
    assert.equal(
      embed.toJSON().description,
      "One of my duties is to manage the economy of our community.\n\nYou earn NaomiCoin slowly as you interact with your fellow members, and can be granted currency by Naomi for specific events and rewards.\n\nYou can use your currency to purchase items with the `/currency purchase` command. If you want to know about a specific item, you can look it up with the `/currency item` command. See how much you currently have with the `/currency wallet` command!\n\nCurrencies have no cash value."
    );
    assert.deepEqual(embed.toJSON().fields, [
      {
        name: "Currency values",
        value:
          "One <:naomicopper:1140129937173520499> is worth 1 NaomiCoin.\nOne <:naomisilver:1140129928084455474> is worth 100 NaomiCoin.\nOne <:naomigold:1140129934526914690> is worth 10,000 NaomiCoin.\nOne <:naomiplatinum:1140129931343446076> is worth 1,000,000 NaomiCoin.\nOne <:naomiamethyst:1140325730304147527> is worth 100,000,000 NaomiCoin.",
      },
    ]);
  });
});
