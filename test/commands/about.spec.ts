import { assert } from "chai";
import { APIEmbedField, ChannelType, EmbedBuilder } from "discord.js";
import {
  MockChannel,
  MockChatInputCommandInteraction,
  MockGuild,
  MockMember,
  MockUser,
} from "discordjs-testing";

import { about } from "../../src/commands/about";

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

suite("about command", () => {
  test("sends the correct embed", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "about",
      guild,
      bot,
      user,
      member,
      channel,
    });
    await about.run({ commit: "12345678" } as never, command as never);
    assert.lengthOf(command.replies, 1);
    const embed = command.replies[0]?.embeds?.[0] as EmbedBuilder;
    assert.strictEqual(embed.data.title, "About Melody");
    assert.strictEqual(
      embed.data.description,
      "Melody is Naomi's personal assistant bot, helping to manage aspects of the community here on Discord and on GitHub."
    );
    const [version, commit, source, files, lines, coverage] = embed.data
      .fields as APIEmbedField[];
    assert.strictEqual(version.name, "Version");
    assert.match(
      version.value,
      new RegExp(process.env.npm_package_version || "fake")
    );
    assert.equal(commit.name, "Commit");
    assert.equal(
      commit.value,
      "[1234567](https://github.com/naomi-lgbt/melody-iuvo/commit/12345678)"
    );
    assert.equal(source.name, "Source Code");
    assert.match(source.value, /github\.com\/naomi-lgbt\/melody-iuvo/);
    assert.equal(files.name, "Files");
    assert.match(files.value, /^\d+$/);
    assert.equal(lines.name, "Lines of Code");
    assert.match(lines.value, /^\d+$/);
    assert.equal(coverage.name, "Code Coverage");
    assert.match(coverage.value, /[\d.]+%/);
    assert.match(coverage.value, /naomi\.lgbt\/melody-iuvo/);
  });
});
