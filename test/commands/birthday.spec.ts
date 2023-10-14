import { assert } from "chai";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import {
  MockChannel,
  MockChatInputCommandInteraction,
  MockGuild,
  MockMember,
  MockUser,
} from "discordjs-testing";

import { birthday } from "../../src/commands/birthday";
import { Database } from "../__mocks__/Database.mock";

const db = new Database();
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

suite("birthday command", () => {
  test("rejects on an invalid month string", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "about",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "month",
          value: "Naomi",
          type: ApplicationCommandOptionType.String,
        },
        {
          name: "day",
          value: 1,
          type: ApplicationCommandOptionType.Integer,
        },
      ],
    });
    await birthday.run({ db } as never, command as never);
    assert.lengthOf(command.replies, 1);
    assert.strictEqual(
      command.replies[0].content,
      "Naomi 1 is not a valid date!"
    );
  });

  test("sets a valid date", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "about",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "month",
          value: "Oct",
          type: ApplicationCommandOptionType.String,
        },
        {
          name: "day",
          value: 1,
          type: ApplicationCommandOptionType.Integer,
        },
      ],
    });
    await birthday.run({ db } as never, command as never);
    const userRecord = await db.users.findUnique({
      where: {
        userId: user.id,
      },
    });
    assert.lengthOf(command.replies, 1);
    assert.strictEqual(
      command.replies[0].content,
      "Your birthday has been set to Oct-1!"
    );
    assert.strictEqual(userRecord?.birthday, 970383600000);
  });
});
