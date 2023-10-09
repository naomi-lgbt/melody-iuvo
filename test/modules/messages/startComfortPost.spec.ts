import { assert } from "chai";
import { ChannelType } from "discord.js";
import { MockChannel, MockGuild, MockUser } from "discordjs-testing";

import { startComfortPost } from "../../../src/modules/messages/startComfortPost";

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

suite("startComfortPost", () => {
  test("should post the ticket message", async () => {
    const msg = await channel.send("~comfort", user);
    await startComfortPost({} as never, msg as never);
    assert.equal(channel.messages.cache.size, 2);
    const response = channel.messages.cache.last();
    assert.strictEqual(
      response?.content,
      `# Need Comfort?

This system allows you to request comfort from Mama Naomi. Clicking the button below will create a private thread where you can get guidance or reassurance from her.

Please note that we are not mental health professionals. For serious issues, we encourage you to seek the support that you need. This system is only for basic pick-me-ups and love.

All conversations in these threads must still comply with our Code of Conduct and Discord's Terms of Service.`
    );
  });
});
