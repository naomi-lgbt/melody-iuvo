import { assert } from "chai";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import {
  MockChannel,
  MockChatInputCommandInteraction,
  MockGuild,
  MockMember,
  MockUser
} from "discordjs-testing";

import { bean } from "../../src/commands/bean";

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
const naomiUser = new MockUser({
  username: "Naomi",
  avatar: "test",
  discriminator: 1234,
  bot: false,
  system: false
});
// @ts-expect-error overriding ID for testing.
naomiUser._id = "465650873650118659";
const member = new MockMember({
  guild,
  user
});
const channel = new MockChannel({
  name: "test-channel",
  guild,
  type: ChannelType.GuildText
});

suite("bean command", () => {
  test("rejects on not naomi", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "bean",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "target",
          value: user,
          type: ApplicationCommandOptionType.User
        },
        {
          name: "reason",
          value: "Testy",
          type: ApplicationCommandOptionType.String
        }
      ]
    });
    await bean.run({} as never, command as never);
    assert.lengthOf(command.replies, 1);
    assert.strictEqual(
      command.replies[0].content,
      "Only Mama Naomi may use this command."
    );
  });

  test("sets a user as beaned", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "about",
      guild,
      bot,
      user: naomiUser,
      member,
      channel,
      options: [
        {
          name: "target",
          value: user,
          type: ApplicationCommandOptionType.User
        },
        {
          name: "reason",
          value: "Testy",
          type: ApplicationCommandOptionType.String
        }
      ]
    });
    const botMock = { beanedUser: null, general: channel };
    await bean.run(botMock as never, command as never);
    assert.lengthOf(command.replies, 1);
    assert.strictEqual(command.replies[0].content, "Done~!");
    assert.strictEqual(channel.messages.cache.size, 1);
    const message = channel.messages.cache.first();
    assert.exists(message);
    assert.strictEqual(
      message?.content,
      `<@!${user.id}> has been beaned!\nWhy?\nWell...\nTesty`
    );
    assert.strictEqual(botMock.beanedUser, user.id);
  });
});
