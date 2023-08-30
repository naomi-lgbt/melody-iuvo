import { assert } from "chai";
import { ChannelType, EmbedBuilder } from "discord.js";
import { MockChannel, MockGuild, MockUser } from "discordjs-testing";

import { startTicketPost } from "../../../src/modules/messages/startTicketPost";

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

suite("startTicketPost", () => {
  test("should post the ticket message", async () => {
    const msg = await channel.send("ticket", user);
    await startTicketPost({} as never, msg as never);
    assert.equal(channel.messages.cache.size, 2);
    const response = channel.messages.cache.last();
    const embed = response?.embeds?.[0] as EmbedBuilder;
    assert.strictEqual(embed.toJSON().title, "Need Help?");
    assert.strictEqual(
      embed.toJSON().description,
      "If you need help with one of our projects, and you want to speak with our support team privately, you can open a ticket!\n\nClick the button below to open a private ticket with the support team."
    );
    assert.strictEqual(embed.toJSON().color, 39423);
  });
});
