import { assert } from "chai";
import { ChannelType } from "discord.js";
import {
  MockChannel,
  MockChatInputCommandInteraction,
  MockGuild,
  MockMember,
  MockUser,
  MockWebhook
} from "discordjs-testing";

import { handleNaomiAsk } from "../../../../src/modules/subcommands/naomi/handleNaomiAsk";

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
suite("handleNaomiAsk", () => {
  test("should display the modal", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "naomi",
      subcommandName: "ask",
      guild,
      bot,
      user,
      member,
      channel
    });
    await handleNaomiAsk(
      { ...bot, env: { debugHook } } as never,
      command.typeCast()
    );
    assert.isNotNull(command.modal);
    assert.strictEqual(command.modal?.toJSON().title, "Ask Naomi");
    assert.strictEqual(
      command.modal?.toJSON().components[0]?.components[0]?.label,
      "What's your question?"
    );
  });
});
