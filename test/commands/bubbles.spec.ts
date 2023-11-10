import { assert } from "chai";
import { ChannelType } from "discord.js";
import {
  MockChannel,
  MockChatInputCommandInteraction,
  MockGuild,
  MockMember,
  MockUser
} from "discordjs-testing";

import { bubbles } from "../../src/commands/bubbles";

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

suite("bubbles command", () => {
  test("creates the correct bubble wrap", async () => {
    for (let i = 0; i < 1000; i++) {
      const command = new MockChatInputCommandInteraction({
        commandName: "bubbles",
        guild,
        bot,
        user,
        member,
        channel
      });
      await bubbles.run({ commit: "12345678" } as never, command as never);
      assert.lengthOf(command.replies, 1);
      const content = command.replies[0].content ?? "";
      assert.isBelow(content.length, 2000, "Message is too long for Discord.");
      assert.match(content, /^Please enjoy this sheet of bubble wrap\.\n/);
      const wrap = content.replace(
        "Please enjoy this sheet of bubble wrap.\n",
        ""
      );
      const rows = wrap.split("\n");
      assert.isAtLeast(rows.length, 4, "Has not enough rows.");
      assert.isAtMost(rows.length, 7, "Has too many rows.");
      for (const row of rows) {
        const columns = row.replace(
          /\|\|<a:bubble:1172567849550745720>\|\|/g,
          "."
        );
        assert.isAtLeast(columns.length, 4, "Has not enough columns.");
        assert.isAtMost(columns.length, 7, "Has too many columnsd.");
      }
    }
  });
});
