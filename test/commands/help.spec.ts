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

import { help } from "../../src/commands/help";

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

suite("Help command", () => {
  test("should respond correctly", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "help",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "question",
          value: "How do I get Naomi to do work for me?",
          type: ApplicationCommandOptionType.String,
        },
      ],
    });
    await help.run({ ...bot, env: { debugHook } } as never, command.typeCast());
    assert.equal(command.replies.length, 1);
    assert.strictEqual(
      command.replies[0]?.content,
      "Greetings! I am Melody Iuvo, Naomi's personal assistant. My role here is to provide access to information you might need when finding your way around our community. Use my `/faq` command if you have a question!\n\nI want to ensure you have fun while you are here, so I also manage a few other facets of our group."
    );
  });
});
