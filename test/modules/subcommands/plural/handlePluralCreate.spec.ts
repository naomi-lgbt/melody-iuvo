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

import { handlePluralCreate } from "../../../../src/modules/subcommands/plural/handlePluralCreate";
import { Database } from "../../../__mocks__/Database.mock";

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
const debugHook = new MockWebhook({
  channel,
  user: bot,
});
suite("handlePluralCreate", () => {
  test("should successfully create an alter", async () => {
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
          type: ApplicationCommandOptionType.String,
        },
        {
          name: "avatar",
          value: "https://cdn.nhcarrigan.com/profile.png",
          type: ApplicationCommandOptionType.String,
        },
        {
          name: "prefix",
          value: "~ta",
          type: ApplicationCommandOptionType.String,
        },
      ],
    });
    await command.deferReply();
    await handlePluralCreate(
      { ...bot, env: { debugHook }, db } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    assert.strictEqual(
      command.replies[0]?.content,
      "I have created that identity for you. Start a message with `~ta ` and I will replace it with a message sent from your identity."
    );
  });

  test("should not allow duplicate names", async () => {
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
          type: ApplicationCommandOptionType.String,
        },
        {
          name: "avatar",
          value: "https://cdn.nhcarrigan.com/profile.png",
          type: ApplicationCommandOptionType.String,
        },
        {
          name: "prefix",
          value: "~ta",
          type: ApplicationCommandOptionType.String,
        },
      ],
    });
    await command.deferReply();
    await handlePluralCreate(
      { ...bot, env: { debugHook }, db } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    assert.strictEqual(
      command.replies[0]?.content,
      "Please forgive me, but you already have an identity with that name."
    );
  });

  test("should not allow more than five alters", async () => {
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
          type: ApplicationCommandOptionType.String,
        },
        {
          name: "avatar",
          value: "https://cdn.nhcarrigan.com/profile.png",
          type: ApplicationCommandOptionType.String,
        },
        {
          name: "prefix",
          value: "~ta",
          type: ApplicationCommandOptionType.String,
        },
      ],
    });
    await db.users.update({
      where: {
        userId: user.id,
      },
      data: {
        plurals: [1, 2, 3, 4, 5],
      },
    });
    await command.deferReply();
    await handlePluralCreate(
      { ...bot, env: { debugHook }, db } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    assert.strictEqual(
      command.replies[0]?.content,
      "Please forgive me, but because I am so new at this I can only support 5 identities at this time."
    );
  });
});
