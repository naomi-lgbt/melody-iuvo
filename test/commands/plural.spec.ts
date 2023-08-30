import { assert } from "chai";
import { ChannelType } from "discord.js";
import {
  MockChannel,
  MockChatInputCommandInteraction,
  MockGuild,
  MockMember,
  MockUser,
  MockWebhook,
} from "discordjs-testing";

import { plural } from "../../src/commands/plural";

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

suite("Plural command", () => {
  test("Should handle an invalid subcommand", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "plural",
      subcommandName: "invalid",
      guild,
      bot,
      user,
      member,
      channel,
    });
    await plural.run(
      { ...bot, env: { debugHook } } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    assert.deepEqual(
      command.replies[0]?.content,
      "I have failed you once again. The command you used does not have an instruction manual for me."
    );
  });

  test("should handle a valid subcommand", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "plural",
      subcommandName: "front",
      guild,
      bot,
      user,
      member,
      channel,
    });
    await plural.run(
      { ...bot, env: { debugHook } } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    assert.notEqual(
      command.replies[0]?.content,
      "I have failed you once again. The command you used does not have an instruction manual for me."
    );
  });
});
