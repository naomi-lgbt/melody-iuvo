import { assert } from "chai";
import { ChannelType } from "discord.js";
import { MockChannel, MockGuild, MockUser } from "discordjs-testing";

import { pruneInactiveUsers } from "../../../src/modules/messages/pruneInactiveUsers";
import { Database } from "../../__mocks__/Database.mock";

const db = new Database();
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

suite("pruneInactiveUsers", () => {
  test("should not prune users active within the last month", async () => {
    await guild.members.add(user);
    const message = await channel.send("prune --dryrun", user);
    await pruneInactiveUsers({ db } as never, message as never);
    assert.equal(channel.messages.cache.size, 2);
    const reply = channel.messages.cache.last();
    assert.equal(reply?.content, "Would kick 0 inactive users.");
  });

  test("should prune users inactive for more than a month", async () => {
    const message = await channel.send("prune --dryrun", user);
    db.users.update({
      where: {
        userId: user.id,
      },
      data: {
        timestamp: new Date(Date.now() - 3592000000),
      },
    });
    await pruneInactiveUsers({ db } as never, message as never);
    assert.equal(channel.messages.cache.size, 4);
    const reply = channel.messages.cache.last();
    assert.equal(reply?.content, "Would kick 1 inactive users.");
  });

  test("should actively kick users", async () => {
    const message = await channel.send("prune", user);
    db.users.update({
      where: {
        userId: user.id,
      },
      data: {
        timestamp: new Date(Date.now() - 3592000000),
      },
    });
    await pruneInactiveUsers({ db } as never, message as never);
    assert.equal(channel.messages.cache.size, 6);
    const reply = channel.messages.cache.last();
    assert.equal(reply?.content, "Kicked 1 inactive users.");
    assert.equal(guild.members.cache.size, 0);
  });
});
