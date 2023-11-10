import { assert } from "chai";
import { ChannelType } from "discord.js";
import {
  MockChannel,
  MockChatInputCommandInteraction,
  MockGuild,
  MockMember,
  MockUser
} from "discordjs-testing";

import { minesweeper } from "../../src/commands/minesweeper";

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

suite("minesweeper command", () => {
  test("creates the correct bubble wrap", async () => {
    for (let i = 0; i < 1000; i++) {
      const command = new MockChatInputCommandInteraction({
        commandName: "minesweeper",
        guild,
        bot,
        user,
        member,
        channel
      });
      await minesweeper.run({} as never, command as never);
      assert.lengthOf(command.replies, 1);
      const content = command.replies[0].content ?? "";
      assert.isBelow(content.length, 4000, "Message is too long for Discord.");
      const rows = content.split("\n");
      assert.isAtLeast(rows.length, 5, "Has not enough rows.");
      assert.isAtMost(rows.length, 10, "Has too many rows.");
      for (const row of rows) {
        const columns = row.replace(/\|\|:\w+:\|\|/g, ".").replace(/\s+/g, "");
        assert.isAtLeast(columns.length, 5, "Has not enough columns.");
        assert.isAtMost(columns.length, 10, "Has too many columns.");
      }
    }
  });
});
