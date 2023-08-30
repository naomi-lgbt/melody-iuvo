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

import { assets } from "../../src/commands/assets";
import { defaultAssetEmbed } from "../../src/modules/subcommands/assets/defaultAssetEmbed";

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

suite("Asset command", () => {
  test("Should handle an invalid subcommand", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "assets",
      subcommandName: "invalid",
      guild,
      bot,
      user,
      member,
      channel,
    });
    await assets.run(
      { ...bot, env: { debugHook } } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    assert.deepEqual(command.replies[0]?.embeds?.[0], defaultAssetEmbed);
  });

  test("should handle a valid subcommand", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "assets",
      subcommandName: "adventure",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "target",
          type: ApplicationCommandOptionType.String,
          value: "naomi",
        },
      ],
    });
    await assets.run(
      { ...bot, env: { debugHook } } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    const embed = command.replies[0]?.embeds?.[0] as EmbedBuilder;
    assert.exists(embed);
    assert.notDeepEqual(embed, defaultAssetEmbed);
    assert.strictEqual(
      embed?.toJSON().image?.url,
      "https://cdn.naomi.lgbt/naomi/games/test"
    );
    assert.strictEqual(embed?.toJSON().title, "Test Asset");
    assert.strictEqual(embed?.toJSON().description, "Test Description");
  });
});
