import { assert } from "chai";
import { ChannelType, Collection } from "discord.js";
import {
  MockChannel,
  MockGuild,
  MockMember,
  MockUser,
} from "discordjs-testing";

import { messageCreate } from "../../src/events/messageCreate";
import { sumCurrency } from "../../src/modules/sumCurrency";
import { Database } from "../__mocks__/Database.mock";

const db = new Database();
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
const naomi = new MockUser({
  username: "Naomi",
  avatar: "test",
  discriminator: 1234,
  bot: false,
  system: false,
});
// @ts-expect-error ID set for testing
naomi._id = "465650873650118659";
const bot = new MockUser({
  username: "Test Bot",
  avatar: "test",
  discriminator: 1234,
  bot: true,
  system: false,
});
const channel = new MockChannel({
  name: "test-channel",
  guild,
  type: ChannelType.GuildText,
});
const member = new MockMember({
  guild,
  user,
});
const naomiMember = new MockMember({
  guild,
  user: naomi,
});

const fakeClient = {
  env: {
    pluralLogHook: {
      messages: [] as unknown[],
      send: (message: unknown) =>
        fakeClient.env.pluralLogHook.messages.push(message),
    },
    debugHook: {
      messages: [] as unknown[],
      send: (message: unknown) =>
        fakeClient.env.debugHook.messages.push(message),
    },
  },
};

suite("messageCreate", () => {
  test("should not respond to bot messages", async () => {
    const msg = await channel.send("test", bot);
    await messageCreate({} as never, msg as never);
    assert.equal(channel.messages.cache.size, 1);
  });

  test("should reply to messages with name", async () => {
    const msg = await channel.send("melody", user, member);
    await messageCreate({ db } as never, msg as never);
    assert.equal(channel.messages.cache.size, 3);
    const response = channel.messages.cache.last();
    assert.equal(response?.content, "Yes? How may I be of service to you?");
  });

  test("should reply to messages with name when special response", async () => {
    const naomiMember = new MockMember({
      guild,
      user: naomi,
    });
    const msg = await channel.send("melody", naomi, naomiMember);
    await messageCreate({ db } as never, msg as never);
    assert.equal(channel.messages.cache.size, 5);
    const response = channel.messages.cache.last();
    assert.equal(
      response?.content,
      "Hello, Mama. Might I be of assistance?"
    );
  });

  test("should process ticket command", async () => {
    const msg = await channel.send("~tickets", naomi, member);
    await messageCreate({ db } as never, msg as never);
    assert.equal(channel.messages.cache.size, 7);
    const response = channel.messages.cache.last();
    assert.exists(response?.embeds?.[0]);
  });

  test("should process prune command", async () => {
    const msg = await channel.send("~prune --dryrun", naomi, member);
    await messageCreate({ db } as never, msg as never);
    assert.equal(channel.messages.cache.size, 9);
    const response = channel.messages.cache.last();
    assert.equal(response?.content, "Would kick 0 inactive users.");
  });

  test("should process autofronted proxy", async () => {
    const msg = await channel.send("test", user, member);
    await db.users.update({
      where: {
        userId: user.id,
      },
      data: {
        plurals: [
          {
            name: "plural",
            prefix: "~pk",
            avatar: "https://cdn.nhcarrigan.com/profile.png",
          },
        ],
        front: "plural",
      },
    });
    await messageCreate({ ...fakeClient, db } as never, msg as never);
    assert.equal(channel.messages.cache.size, 11);
    const [command, response] = channel.messages.cache.last(2);
    assert.isTrue(command.deleted);
    assert.equal(response?.content, "test");
  });

  test("should process prefix proxy", async () => {
    const msg = await channel.send("~pk test", user, member);
    await db.users.update({
      where: {
        userId: user.id,
      },
      data: {
        plurals: [
          {
            name: "plural",
            prefix: "~pk",
            avatar: "https://cdn.nhcarrigan.com/profile.png",
          },
        ],
        front: "",
      },
    });
    await messageCreate({ ...fakeClient, db } as never, msg as never);
    assert.equal(channel.messages.cache.size, 13);
    const [command, response] = channel.messages.cache.last(2);
    assert.isTrue(command.deleted);
    assert.equal(response?.content, "test");
  });

  test("should respond to good morning", async () => {
    const msg = await channel.send("good morning", user, member);
    await messageCreate({ db } as never, msg as never);
    assert.equal(channel.messages.cache.size, 15);
    const response = channel.messages.cache.last();
    assert.equal(response?.content, "Good morning! How are you today?");
  });
  test("should respond to good night", async () => {
    const msg = await channel.send("good night", user, member);
    await messageCreate({ db } as never, msg as never);
    assert.equal(channel.messages.cache.size, 17);
    const response = channel.messages.cache.last();
    assert.equal(response?.content, "Good night! We shall see you tomorrow.");
  });
  // TODO: Cannot test until utility supports mentions
  // test("should respond to thanks", async () => {

  // });
  test("should respond to sorry", async () => {
    const msg = await channel.send("sorry", user, member);
    await messageCreate({ db } as never, msg as never);
    assert.equal(channel.messages.cache.size, 19);
    const response = channel.messages.cache.last();
    assert.equal(
      response?.content,
      `It's okay, Test User. We all have our moments.`
    );
  });

  test("should not respond to thanks when no mention", async () => {
    const msg = await channel.send("thanks", user, member);
    const collection = new Collection();
    // @ts-expect-error Assigning to non-defined property until test package is updated
    msg.mentions = { members: collection };
    await messageCreate({ db } as never, msg as never);
    assert.equal(channel.messages.cache.size, 20);
    const response = channel.messages.cache.last();
    assert.equal(response?.content, "thanks");
  });

  test("should respond to thanks when mention", async () => {
    const msg = await channel.send("thanks", user, member);
    const collection = new Collection([[naomiMember.id, naomiMember]]);
    // @ts-expect-error Assigning to non-defined property until test package is updated
    msg.mentions = { members: collection };
    await messageCreate({ db } as never, msg as never);
    assert.equal(channel.messages.cache.size, 22);
    const response = channel.messages.cache.last();
    assert.equal(
      response?.content,
      "Mama, are you certain you are not pushing yourself too hard?"
    );
  });

  test("should process currency", async () => {
    const msg = await channel.send("test", user, member);
    await messageCreate({ db } as never, msg as never);
    assert.equal(channel.messages.cache.size, 23);
    const record = await db.users.findUnique({
      where: {
        userId: user.id,
      },
    });
    assert.isNotNull(record);
    // @ts-expect-error It's not null, the assertion would throw.
    const total = sumCurrency(record.currency);
    assert.isAbove(total, 0);
  });
});
