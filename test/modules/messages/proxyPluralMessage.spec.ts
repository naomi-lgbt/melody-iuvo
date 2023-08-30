import { assert } from "chai";
import { ChannelType } from "discord.js";
import { MockChannel, MockGuild, MockUser } from "discordjs-testing";

import { proxyPluralMessage } from "../../../src/modules/messages/proxyPluralMessage";

const dmChannel = new MockChannel({
  name: "test-channel",
  type: ChannelType.DM,
});
const guild = new MockGuild({
  name: "test-guild",
});
const channel = new MockChannel({
  name: "test-channel",
  type: ChannelType.GuildText,
  guild,
});
const user = new MockUser({
  username: "test-user",
  avatar: "https://cdn.nhcarrigan.com/profile.png",
  bot: false,
  system: false,
  discriminator: 0,
});
const plural = {
  name: "test-plural",
  prefix: "~test",
  avatar: "https://cdn.nhcarrigan.com/profile.png",
};

const fakeClient = {
  env: {
    pluralLogHook: {
      messages: [] as unknown[],
      send: (message: unknown) =>
        fakeClient.env.pluralLogHook.messages.push(message),
    },
  },
};

suite("proxyPluralMessage", () => {
  test("Does not send in DM channels", async () => {
    const msg = await dmChannel.send("test", user);
    await proxyPluralMessage({} as never, msg as never, plural);
    assert.equal(dmChannel.messages.cache.size, 1);
    const first = dmChannel.messages.cache.first();
    assert.equal(first?.author.id, user.id);
  });

  test("properly sends a proxied message", async () => {
    const msg = await channel.send("~test test", user);
    await proxyPluralMessage(fakeClient as never, msg as never, plural);
    assert.equal(channel.messages.cache.size, 2);
    const first = channel.messages.cache.first();
    const second = channel.messages.cache.last();
    assert.isTrue(first?.deleted);
    assert.equal(second?.author.username, plural.name);
    assert.equal(second?.author.displayAvatarURL(), plural.avatar);
    assert.equal(second?.content, "test");
  });
});
