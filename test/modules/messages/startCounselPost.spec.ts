import { assert } from "chai";
import { ChannelType } from "discord.js";
import { MockChannel, MockGuild, MockUser } from "discordjs-testing";

import { startCounselPost } from "../../../src/modules/messages/startCounselPost";

const guild = new MockGuild({
  name: "test-guild"
});
const channel = new MockChannel({
  name: "test-channel",
  type: ChannelType.GuildText,
  guild
});
const user = new MockUser({
  username: "test-user",
  avatar: "https://cdn.nhcarrigan.com/profile.png",
  bot: false,
  system: false,
  discriminator: 0
});

suite("startCounselPost", () => {
  test("should post the counsel message", async () => {
    const msg = await channel.send("~counsel", user);
    await startCounselPost({} as never, msg as never);
    assert.equal(channel.messages.cache.size, 2);
    const response = channel.messages.cache.last();
    assert.strictEqual(
      response?.content,
      `# Need some assistance?

First, what kind of assistance do you need? If you need some comfort or reassurance, click "Comfort". If you need help with one of our projects, click "Support".

- The comfort system allows you to request comfort from Mama Naomi. Clicking the button will create a private thread where you can get guidance or reassurance from her. Please note that we are not mental health professionals. For serious issues, we encourage you to seek the support that you need. This system is only for basic pick-me-ups and love. All conversations in these threads must still comply with our Code of Conduct and Discord's Terms of Service.
- The support system allows you to speak with our staff team privately. Clicking the button will create a private thread where you can ask your question regarding our project. Please note that tickets opened for general chatter will be closed, and users will be actioned.`
    );
  });
});
