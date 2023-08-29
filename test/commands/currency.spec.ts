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

import { currency } from "../../src/commands/currency";

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

suite("Currency command", () => {
  test("Should handle an invalid subcommand", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "currency",
      subcommandName: "invalid",
      guild,
      bot,
      user,
      member,
      channel,
    });
    await currency.run(
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
      commandName: "currency",
      subcommandName: "about",
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
    await currency.run(
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
