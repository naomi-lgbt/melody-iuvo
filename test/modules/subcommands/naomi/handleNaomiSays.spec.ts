import { assert } from "chai";
import {
  ApplicationCommandOptionType,
  AttachmentBuilder,
  ChannelType
} from "discord.js";
import {
  MockChannel,
  MockChatInputCommandInteraction,
  MockGuild,
  MockMember,
  MockUser,
  MockWebhook
} from "discordjs-testing";

import { handleNaomiSays } from "../../../../src/modules/subcommands/naomi/handleNaomiSays";

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
suite("handleNaomiSays", () => {
  test("should display the modal", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "naomi",
      subcommandName: "says",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "message",
          value: "Hello, world!",
          type: ApplicationCommandOptionType.String
        }
      ]
    });
    await command.deferReply();
    await handleNaomiSays(
      { ...bot, env: { debugHook } } as never,
      command.typeCast()
    );
    const attachment = command.replies[0]
      ?.attachments?.[0] as AttachmentBuilder;
    assert.strictEqual(attachment.name, "say.png");
    assert.strictEqual(attachment.description, "Naomi says: Hello, world!");
  });
});
