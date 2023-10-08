import { assert } from "chai";
import { ChannelType } from "discord.js";
import { MockGuild, MockUser } from "discordjs-testing";

import { autoModerationActionExecution } from "../../src/events/autoModerationActionExecution";

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

const naomiUser = new MockUser({
  username: "Naomi",
  avatar: "test",
  discriminator: 1234,
  bot: false,
  system: false,
});
// @ts-expect-error overriding ID for testing.
naomiUser._id = "465650873650118659";
const action = {
  userId: user.id,
  guild,
};

suite("autoModerationActionExecution event", () => {
  test("should not send message without AUTOMOD_TEASE_CHANNEL_ID", async () => {
    const channel = await guild.channels.create({
      name: "test-channel",
      type: ChannelType.GuildText,
    });
    await autoModerationActionExecution(
      { automod: {} } as never,
      action as never
    );
    assert.equal(channel.messages.cache.size, 0);
  });

  test("should not send if channel is not a text channel", async () => {
    const channel = await guild.channels.create({
      name: "test-channel",
      type: ChannelType.GuildCategory,
    });
    await autoModerationActionExecution(
      { automod: {} } as never,
      action as never
    );
    assert.equal(channel.messages.cache.size, 0);
  });

  test("should not send if member record not found", async () => {
    const channel = await guild.channels.create({
      name: "test-channel",
      type: ChannelType.GuildText,
    });
    process.env.AUTOMOD_TEASE_CHANNEL_ID = channel.id;
    await autoModerationActionExecution(
      { automod: {} } as never,
      action as never
    );
    assert.equal(channel.messages.cache.size, 0);
    delete process.env.AUTOMOD_TEASE_CHANNEL_ID;
  });

  test("should send the message when automod is triggered", async () => {
    const channel = await guild.channels.create({
      name: "test-channel",
      type: ChannelType.GuildText,
    });
    guild.members.add(user);
    process.env.AUTOMOD_TEASE_CHANNEL_ID = channel.id;
    await autoModerationActionExecution(
      { automod: {} } as never,
      action as never
    );
    assert.equal(channel.messages.cache.size, 1);
    assert.equal(
      channel.messages.cache.first()?.content,
      `Oh dear, it would seem that <@${user.id}> has been naughty.`
    );
    delete process.env.AUTOMOD_TEASE_CHANNEL_ID;
  });

  test("should send the message when automod is triggered by special response", async () => {
    const naomiAction = {
      userId: "465650873650118659",
      guild,
    };
    guild.members.add(naomiUser);
    const channel = await guild.channels.create({
      name: "test-channel",
      type: ChannelType.GuildText,
    });
    process.env.AUTOMOD_TEASE_CHANNEL_ID = channel.id;
    await autoModerationActionExecution(
      { automod: {} } as never,
      naomiAction as never
    );
    assert.equal(channel.messages.cache.size, 1);
    assert.equal(
      channel.messages.cache.first()?.content,
      "Mama, you run this community, and you cannot follow the rules?"
    );
    delete process.env.AUTOMOD_TEASE_CHANNEL_ID;
  });

  test("should not trigger within the cooldown", async () => {
    const channel = await guild.channels.create({
      name: "test-channel",
      type: ChannelType.GuildText,
    });
    process.env.AUTOMOD_TEASE_CHANNEL_ID = channel.id;
    await autoModerationActionExecution(
      { automod: { [user.id]: Date.now() } } as never,
      action as never
    );
    assert.equal(channel.messages.cache.size, 0);
    delete process.env.AUTOMOD_TEASE_CHANNEL_ID;
  });
});
