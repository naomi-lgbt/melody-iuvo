import { assert } from "chai";
import { ChannelType, EmbedBuilder } from "discord.js";
import {
  MockChannel,
  MockChatInputCommandInteraction,
  MockGuild,
  MockMember,
  MockUser,
  MockWebhook
} from "discordjs-testing";

import { handleCurrencyWallet } from "../../../../src/modules/subcommands/currency/handleCurrencyWallet";
import { Database } from "../../../__mocks__/Database.mock";

const db = new Database();
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

suite("handleCurrencyWallet", () => {
  test("should display the funds correctly.", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "currency",
      subcommandName: "wallet",
      guild,
      bot,
      user,
      member,
      channel
    });
    await command.deferReply({ ephemeral: true });
    await handleCurrencyWallet(
      { ...bot, env: { debugHook }, db, cache: { wordGame: {} } } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    const embed = command.replies[0]?.embeds?.[0] as EmbedBuilder;
    assert.strictEqual(embed.toJSON().title, "Your NaomiCoin");
    assert.strictEqual(
      embed.toJSON().description,
      "<:naomicopper:1146242994475900938>: 0\n<:naomisilver:1146242999471321159>: 0\n<:naomigold:1146242995893583973>: 0\n<:naomiplatinum:1146242997252530246>: 0\n<:naomiamethyst:1146242992315826206>: 0"
    );
    assert.deepEqual(embed?.toJSON().fields, [
      {
        name: "Total",
        value: "0"
      }
    ]);
  });
});
