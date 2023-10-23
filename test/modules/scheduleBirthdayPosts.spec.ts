import { assert } from "chai";
import { ChannelType, EmbedBuilder } from "discord.js";
import { MockChannel, MockGuild } from "discordjs-testing";

import { BirthdayGifs } from "../../src/config/BirthdayGifs";
import { scheduleBirthdayPosts } from "../../src/modules/scheduleBirthdayPosts";
import { Database } from "../__mocks__/Database.mock";

const db = new Database();
const guild = new MockGuild({
  name: "Test Guild"
});
const general = new MockChannel({
  name: "test-channel",
  guild,
  type: ChannelType.GuildText
});

suite("schedule birthday posts", () => {
  test("does nothing when no birthdays found.", async () => {
    await scheduleBirthdayPosts({ general, db } as never);
    assert.strictEqual(general.messages.cache.size, 0);
  });

  test("posts correct content and embed when birthdays found.", async () => {
    const month = new Date().toLocaleString("default", { month: "long" });
    const day = new Date().getDate();
    await db.users.upsert({
      where: {
        userId: "12345"
      },
      create: {
        userId: "12345",
        birthday: new Date(`${month}-${day}-2000`)
      }
    });
    await scheduleBirthdayPosts({ general, db } as never);
    assert.strictEqual(general.messages.cache.size, 1);
    assert.strictEqual(general.messages.cache.last()?.content, `<@!12345>`);
    const embed = general.messages.cache.last()?.embeds?.[0] as EmbedBuilder;
    assert.exists(embed);
    assert.strictEqual(embed.data.title, "Happy Birthday~! 🎉🥳🎊");
    assert.strictEqual(
      embed.data.description,
      "We hope you have an absolutely stupendous and wonderful day! 🎂🎈🎁\n\nFriends, feel free to share your birthday wishes! 💜"
    );
    assert.include(BirthdayGifs, embed.data.image?.url);
  });
});
