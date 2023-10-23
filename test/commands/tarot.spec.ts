import { assert } from "chai";
import {
  ApplicationCommandOptionType,
  ChannelType,
  EmbedBuilder
} from "discord.js";
import {
  MockChannel,
  MockChatInputCommandInteraction,
  MockGuild,
  MockMember,
  MockUser
} from "discordjs-testing";

import { tarot } from "../../src/commands/tarot";
import { TarotChoices, TarotHeaders } from "../../src/config/TarotCards";

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

suite("tarot command", () => {
  const cache = { tarot: {} };

  test("should not allow invalid type", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "tarot",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "type",
          value: "naomi",
          type: ApplicationCommandOptionType.String
        }
      ]
    });
    await tarot.run({ cache } as never, command as never);
    assert.equal(command.replies.length, 1);
    assert.equal(
      command.replies[0]?.content,
      "I am not quite sure how to do that reading..."
    );
  });

  test("sends the correct embed", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "tarot",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "type",
          value: "general",
          type: ApplicationCommandOptionType.String
        }
      ]
    });
    await tarot.run({ cache } as never, command as never);
    assert.equal(command.replies.length, 1);
    const embed = command.replies[0]?.embeds?.[0] as EmbedBuilder;
    assert.exists(embed);
    assert.equal(embed.data.title, "Your Tarot Reading");
    assert.equal(embed.data.description, TarotChoices.general);
    assert.equal(embed.data.fields?.length, 5);
    assert.equal(embed.data.fields?.[0].name, TarotHeaders.general.first);
    assert.equal(embed.data.fields?.[1].name, TarotHeaders.general.second);
    assert.equal(embed.data.fields?.[2].name, TarotHeaders.general.third);
    assert.equal(embed.data.fields?.[3].name, TarotHeaders.general.fourth);
    assert.equal(embed.data.fields?.[4].name, TarotHeaders.general.fifth);
  });

  test("should not allow second reading in same day", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "tarot",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "type",
          value: "general",
          type: ApplicationCommandOptionType.String
        }
      ]
    });
    await tarot.run({ cache } as never, command as never);
    assert.equal(command.replies.length, 1);
    assert.equal(
      command.replies[0]?.content,
      "It is dangerous to do more than one reading per day. You risk angering many spirits."
    );
  });

  test("should allow a run after more than 24 hours", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "tarot",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "type",
          value: "general",
          type: ApplicationCommandOptionType.String
        }
      ]
    });
    cache.tarot[user.id] = {
      lastPlayed: Date.now() - 1000 * 60 * 60 * 25
    };
    await tarot.run({ cache } as never, command as never);
    assert.equal(command.replies.length, 1);
    const embed = command.replies[0]?.embeds?.[0] as EmbedBuilder;
    assert.exists(embed);
    assert.equal(embed.data.title, "Your Tarot Reading");
    assert.equal(embed.data.description, TarotChoices.general);
    assert.equal(embed.data.fields?.length, 5);
    assert.equal(embed.data.fields?.[0].name, TarotHeaders.general.first);
    assert.equal(embed.data.fields?.[1].name, TarotHeaders.general.second);
    assert.equal(embed.data.fields?.[2].name, TarotHeaders.general.third);
    assert.equal(embed.data.fields?.[3].name, TarotHeaders.general.fourth);
    assert.equal(embed.data.fields?.[4].name, TarotHeaders.general.fifth);
  });
});
