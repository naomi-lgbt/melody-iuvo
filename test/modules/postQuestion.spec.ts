import { assert } from "chai";
import { ChannelType } from "discord.js";
import { MockChannel, MockGuild } from "discordjs-testing";

import { Questions } from "../../src/config/Questions";
import { postQuestion } from "../../src/modules/postQuestion";

const guild = new MockGuild({
  name: "Test Guild"
});
const general = new MockChannel({
  name: "test-channel",
  guild,
  type: ChannelType.GuildText
});

suite("post question module", () => {
  test("should post a properly formatted question", async () => {
    await postQuestion({ general } as never);
    assert.strictEqual(general.messages.cache.size, 1);
    const message = general.messages.cache.first()?.content;
    if (!message) {
      assert.fail("Message not sent.");
    }
    const hasHeader = message.startsWith("# ");
    const hasMention = message.endsWith("\n<@&1167154309503398018>");
    assert.isTrue(
      hasHeader,
      "Message does not have correct header formatting."
    );
    assert.isTrue(hasMention, "Message does not mention QotD role.");
    const stripped = message
      .replace("# ", "")
      .replace("\n<@&1167154309503398018>", "");
    assert.include(Questions, stripped);
  });
});
