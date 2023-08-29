import { assert } from "chai";
import {
  ApplicationCommandOptionType,
  ChannelType,
  EmbedBuilder,
} from "discord.js";
import {
  MockChannel,
  MockChatInputCommandInteraction,
  MockGuild,
  MockMember,
  MockUser,
  MockWebhook,
} from "discordjs-testing";

import { assets } from "../../src/commands/assets";
import { defaultAssetEmbed } from "../../src/modules/subcommands/assets/defaultAssetEmbed";

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

suite("Asset command", () => {
  test("Should handle an invalid subcommand", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "assets",
      subcommandName: "invalid",
      guild,
      bot,
      user,
      member,
      channel,
    });
    await assets.run(
      { ...bot, env: { debugHook } } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    assert.deepEqual(command.replies[0]?.embeds?.[0], defaultAssetEmbed);
  });

  test("Should handle an incorrect or missing target", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "assets",
      subcommandName: "adventure",
      guild,
      bot,
      user,
      member,
      channel,
    });
    await assets.run(
      { ...bot, env: { debugHook } } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    assert.deepEqual(command.replies[0]?.embeds?.[0], defaultAssetEmbed);
  });

  test("Should display an adventure", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "assets",
      subcommandName: "adventure",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "target",
          type: ApplicationCommandOptionType.String,
          value: "naomi",
        },
      ],
    });
    await assets.run(
      { ...bot, env: { debugHook } } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    const embed = command.replies[0]?.embeds?.[0] as EmbedBuilder;
    assert.strictEqual(
      embed?.toJSON().image?.url,
      "https://cdn.naomi.lgbt/naomi/games/test"
    );
    assert.strictEqual(embed?.toJSON().title, "Test Asset");
    assert.strictEqual(embed?.toJSON().description, "Test Description");
  });

  test("should display an emote", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "assets",
      subcommandName: "emote",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "target",
          type: ApplicationCommandOptionType.String,
          value: "naomi",
        },
      ],
    });
    await assets.run(
      { ...bot, env: { debugHook } } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    const embed = command.replies[0]?.embeds?.[0] as EmbedBuilder;
    assert.strictEqual(
      embed?.toJSON().image?.url,
      "https://cdn.naomi.lgbt/naomi/emotes/test"
    );
    assert.strictEqual(embed?.toJSON().title, "Test Asset");
    assert.strictEqual(embed?.toJSON().description, "Test Description");
  });

  test("should credit starfazers on becca emotes", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "assets",
      subcommandName: "emote",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "target",
          type: ApplicationCommandOptionType.String,
          value: "becca",
        },
      ],
    });
    await assets.run(
      { ...bot, env: { debugHook } } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    const embed = command.replies[0]?.embeds?.[0] as EmbedBuilder;
    assert.strictEqual(
      embed?.toJSON().image?.url,
      "https://cdn.naomi.lgbt/becca/emotes/test"
    );
    assert.strictEqual(embed?.toJSON().title, "Test Asset");
    assert.strictEqual(embed?.toJSON().description, "Test Description");
    assert.deepEqual(embed?.toJSON().fields, [
      {
        name: "Art By:",
        value: "[Starfazers](https://starfazers.art)",
      },
    ]);
  });

  test("should display a koikatsu", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "assets",
      subcommandName: "koikatsu",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "target",
          type: ApplicationCommandOptionType.String,
          value: "naomi",
        },
      ],
    });
    await assets.run(
      { ...bot, env: { debugHook } } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    const embed = command.replies[0]?.embeds?.[0] as EmbedBuilder;
    assert.strictEqual(
      embed?.toJSON().image?.url,
      "https://cdn.naomi.lgbt/naomi/koikatsu/test"
    );
    assert.strictEqual(embed?.toJSON().title, "Test Asset");
    assert.strictEqual(embed?.toJSON().description, "Test Description");
  });

  test("should display an outfit", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "assets",
      subcommandName: "outfit",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "target",
          type: ApplicationCommandOptionType.String,
          value: "naomi",
        },
      ],
    });
    await assets.run(
      { ...bot, env: { debugHook } } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    const embed = command.replies[0]?.embeds?.[0] as EmbedBuilder;
    assert.strictEqual(
      embed?.toJSON().image?.url,
      "https://cdn.naomi.lgbt/naomi/outfits/test"
    );
    assert.strictEqual(embed?.toJSON().title, "Test Asset");
    assert.strictEqual(embed?.toJSON().description, "Test Description");
  });

  test("should display a portrait", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "assets",
      subcommandName: "portrait",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "target",
          type: ApplicationCommandOptionType.String,
          value: "naomi",
        },
      ],
    });
    await assets.run(
      { ...bot, env: { debugHook } } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    const embed = command.replies[0]?.embeds?.[0] as EmbedBuilder;
    assert.strictEqual(
      embed?.toJSON().image?.url,
      "https://cdn.naomi.lgbt/naomi/art/test"
    );
    assert.strictEqual(embed?.toJSON().title, "Test Asset");
    assert.strictEqual(embed?.toJSON().description, "Test Description");
    assert.deepEqual(embed?.toJSON().fields, [
      {
        name: "Art By:",
        value: "[Test Artist](Test URL)",
      },
    ]);
  });

  test("should display a reference", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "assets",
      subcommandName: "reference",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "target",
          type: ApplicationCommandOptionType.String,
          value: "Feet",
        },
      ],
    });
    await assets.run(
      { ...bot, env: { debugHook } } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    const embed = command.replies[0]?.embeds?.[0] as EmbedBuilder;
    assert.strictEqual(
      embed?.toJSON().image?.url,
      "https://cdn.naomi.lgbt/naomi/ref/feet.png"
    );
    assert.strictEqual(embed?.toJSON().title, "Feet");
    assert.strictEqual(
      embed?.toJSON().description,
      "Naomi keeps her toes painted a sparkly purple, and never wears socks or shoes."
    );
  });

  test("should display a tattoo", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "assets",
      subcommandName: "tattoo",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "target",
          type: ApplicationCommandOptionType.String,
          value: "naomi",
        },
      ],
    });
    await assets.run(
      { ...bot, env: { debugHook } } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    const embed = command.replies[0]?.embeds?.[0] as EmbedBuilder;
    assert.strictEqual(
      embed?.toJSON().image?.url,
      "https://cdn.naomi.lgbt/naomi/ref/tattoos/test"
    );
    assert.strictEqual(embed?.toJSON().title, "Test Asset");
    assert.strictEqual(
      embed?.toJSON().description,
      "Naomi's tattoos can be hidden or visible at her whim."
    );
  });
});
