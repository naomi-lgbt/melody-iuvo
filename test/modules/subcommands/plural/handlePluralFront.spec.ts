import { assert } from "chai";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import {
  MockChannel,
  MockChatInputCommandInteraction,
  MockGuild,
  MockMember,
  MockUser,
  MockWebhook
} from "discordjs-testing";

import { handlePluralFront } from "../../../../src/modules/subcommands/plural/handlePluralFront";
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
suite("handlePluralFront", () => {
  test("should not be able to set front without matching alter", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "plural",
      subcommandName: "front",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "name",
          value: "Test Alter",
          type: ApplicationCommandOptionType.String
        }
      ]
    });
    await command.deferReply();
    await handlePluralFront(
      { ...bot, env: { debugHook }, db } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    assert.strictEqual(
      command.replies[0]?.content,
      "Please forgive me, but you do not have an identity with that name."
    );
  });

  test("should reset front when name is not provided", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "plural",
      subcommandName: "front",
      guild,
      bot,
      user,
      member,
      channel
    });
    await command.deferReply();
    await handlePluralFront(
      { ...bot, env: { debugHook }, db } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    assert.strictEqual(
      command.replies[0]?.content,
      "I have disabled auto-proxying for you."
    );
  });

  test("should set a front when configured", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "plural",
      subcommandName: "create",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "name",
          value: "Test Alter",
          type: ApplicationCommandOptionType.String
        }
      ]
    });
    await db.users.update({
      where: {
        userId: user.id
      },
      data: {
        plurals: [
          {
            name: "Test Alter",
            avatar: "https://cdn.nhcarrigan.com/profile.png",
            prefix: "~ta"
          }
        ]
      }
    });
    await command.deferReply();
    await handlePluralFront(
      { ...bot, env: { debugHook }, db } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    assert.strictEqual(
      command.replies[0]?.content,
      "I will now auto-proxy your messages as Test Alter."
    );
  });
});
