import { assert } from "chai";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import {
  MockChannel,
  MockChatInputCommandInteraction,
  MockGuild,
  MockMember,
  MockUser,
} from "discordjs-testing";

import { holopin } from "../../src/commands/holopin";

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

suite("holopin command", () => {
  test("should return an error for an invalid user", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "holopin",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "username",
          value: "alkdsjfadskjfhasdkljhflasdkjhflakjsdhf",
          type: ApplicationCommandOptionType.String,
        },
      ],
    });
    await holopin.run({} as never, command.typeCast());
    assert.lengthOf(command.replies, 1);
    assert.equal(
      command.replies[0].content,
      "Could not locate that user's Holopin badge board."
    );
  });

  test("should display the correct text for a valid user.", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "holopin",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "username",
          value: "nhcarrigan",
          type: ApplicationCommandOptionType.String,
        },
      ],
    });
    await holopin.run({} as never, command.typeCast());
    assert.lengthOf(command.replies, 1);
    assert.equal(
      command.replies[0].content,
      "Remember that you can claim badges for contributing to Mama Naomi's projects by following the instructions in <#1156373406372089877>~!"
    );
    assert.lengthOf(command.replies[0].attachments || [], 1);
  });
});
