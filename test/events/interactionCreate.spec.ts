import { assert } from "chai";
import { ChannelType } from "discord.js";
import {
  MockChannel,
  MockChatInputCommandInteraction,
  MockGuild,
  MockMember,
  MockUser,
} from "discordjs-testing";

import { interactionCreate } from "../../src/events/interactionCreate";

const guild = new MockGuild({
  name: "Test Guild",
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

suite("interactionCreate", () => {
  test("should respond to interactions outside of guild", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "test",
      member,
      user,
      channel,
      bot: user,
    });
    await interactionCreate({} as never, command as never);
    assert.equal(command.replies.length, 1);
    assert.equal(
      command.replies[0].content,
      "Forgive me, but this can only be done within Naomi's community."
    );
  });

  test("should respond to invalid commands", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "test",
      member,
      user,
      channel,
      bot: user,
      guild,
    });
    await interactionCreate({ commands: [] } as never, command as never);
    assert.equal(command.replies.length, 1);
    assert.equal(
      command.replies[0].content,
      "My deepest apologies, but I cannot follow those instructions at this time."
    );
  });
});
