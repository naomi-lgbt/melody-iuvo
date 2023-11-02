import { assert } from "chai";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import {
  MockChannel,
  MockChatInputCommandInteraction,
  MockGuild,
  MockMember,
  MockRole,
  MockUser
} from "discordjs-testing";

import { initiate } from "../../src/commands/initiate";
import { Database } from "../__mocks__/Database.mock";

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
const target = new MockUser({
  username: "Naomi",
  avatar: "test",
  discriminator: 1234,
  bot: false,
  system: false
});
const member = new MockMember({
  guild,
  user
});
const general = new MockChannel({
  name: "test-channel",
  guild,
  type: ChannelType.GuildText
});
const role = new MockRole({
  name: "Coven",
  guild
});

const client = {
  db,
  general,
  coven: role
} as never;

suite("initiate command", () => {
  test("should reject command when target not found", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "currency",
      subcommandName: "about",
      guild,
      bot,
      user,
      member,
      channel: general,
      options: [
        {
          name: "target",
          type: ApplicationCommandOptionType.User,
          value: target
        }
      ]
    });
    await initiate.run(client as never, command.typeCast());
    assert.lengthOf(command.replies, 1);
    const reply = command.replies[0];
    assert.strictEqual(
      reply.content,
      "Forgive me, but I cannot locate that member's records. Please try again later."
    );
  });

  test("should reject command when user is not initiated", async () => {
    await guild.members.add(target);
    const command = new MockChatInputCommandInteraction({
      commandName: "currency",
      subcommandName: "about",
      guild,
      bot,
      user,
      member,
      channel: general,
      options: [
        {
          name: "target",
          type: ApplicationCommandOptionType.User,
          value: target
        }
      ]
    });
    await initiate.run(client as never, command.typeCast());
    assert.lengthOf(command.replies, 1);
    const reply = command.replies[0];
    assert.strictEqual(
      reply.content,
      "Only current coven members may nominate new initiates."
    );
  });

  test("should properly count a nomination", async () => {
    member.roles.cache.set(role.id, role);
    const command = new MockChatInputCommandInteraction({
      commandName: "currency",
      subcommandName: "about",
      guild,
      bot,
      user,
      member,
      channel: general,
      options: [
        {
          name: "target",
          type: ApplicationCommandOptionType.User,
          value: target
        }
      ]
    });
    await initiate.run(client as never, command.typeCast());
    assert.lengthOf(command.replies, 1);
    const reply = command.replies[0];
    assert.strictEqual(reply.content, "Your nomination has been logged.");
    const record = await db.users.findUnique({ where: { userId: target.id } });
    assert.deepStrictEqual(record?.initiations, [user.id]);
    assert.strictEqual(general.messages.cache.size, 0);
  });

  test("should not allow duplicate nomination from same target", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "currency",
      subcommandName: "about",
      guild,
      bot,
      user,
      member,
      channel: general,
      options: [
        {
          name: "target",
          type: ApplicationCommandOptionType.User,
          value: target
        }
      ]
    });
    await initiate.run(client as never, command.typeCast());
    assert.lengthOf(command.replies, 1);
    const reply = command.replies[0];
    assert.strictEqual(
      reply.content,
      "You have already nominated this member for initiation."
    );
    const record = await db.users.findUnique({ where: { userId: target.id } });
    assert.deepStrictEqual(record?.initiations, [user.id]);
    assert.strictEqual(general.messages.cache.size, 0);
  });

  test("should successfully nominate after three nominations", async () => {
    const targetMember = await guild.members.add(target);
    // @ts-expect-error Mocking this because the lib doesn't support it yet
    targetMember.roles.add = targetMember.roles.create;
    await db.users.update({
      where: { userId: target.id },
      data: { initiations: ["1", "2"] }
    });
    const command = new MockChatInputCommandInteraction({
      commandName: "currency",
      subcommandName: "about",
      guild,
      bot,
      user,
      member,
      channel: general,
      options: [
        {
          name: "target",
          type: ApplicationCommandOptionType.User,
          value: target
        }
      ]
    });
    await initiate.run(client as never, command.typeCast());
    assert.lengthOf(command.replies, 1);
    const reply = command.replies[0];
    assert.strictEqual(reply.content, "Your nomination has been logged.");
    const record = await db.users.findUnique({ where: { userId: target.id } });
    assert.deepStrictEqual(record?.initiations, []);
    assert.strictEqual(general.messages.cache.size, 1);
    assert.strictEqual(
      general.messages.cache.first()?.content,
      `## <:pentatrans:1169725148740472912> ${target.username} has been successfully initiated into the coven~! <:pentatrans:1169725148740472912>`
    );
  });

  test("should not nominate once already has role", async () => {
    const targetMember = await guild.members.add(target);
    targetMember.roles.cache.has = () => true;
    const command = new MockChatInputCommandInteraction({
      commandName: "currency",
      subcommandName: "about",
      guild,
      bot,
      user,
      member,
      channel: general,
      options: [
        {
          name: "target",
          type: ApplicationCommandOptionType.User,
          value: target
        }
      ]
    });
    await initiate.run(client as never, command.typeCast());
    assert.lengthOf(command.replies, 1);
    const reply = command.replies[0];
    assert.strictEqual(
      reply.content,
      "They are already a member of our coven!"
    );
    const record = await db.users.findUnique({ where: { userId: target.id } });
    assert.deepStrictEqual(record?.initiations, []);
    assert.strictEqual(general.messages.cache.size, 1);
  });
});
