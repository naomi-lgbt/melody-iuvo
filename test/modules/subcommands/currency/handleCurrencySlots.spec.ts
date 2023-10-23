import { assert } from "chai";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import {
  MockChannel,
  MockChatInputCommandInteraction,
  MockGuild,
  MockMember,
  MockUser,
  MockWebhook
} from "discordjs-testing";

import { handleCurrencySlots } from "../../../../src/modules/subcommands/currency/handleCurrencySlots";
import { Database } from "../../../__mocks__/Database.mock";

const db = new Database();
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
const debugHook = new MockWebhook({
  channel,
  user: bot
});

suite("handleCurrencySlots", () => {
  test("should not allow a wager of more than the balance", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "currency",
      subcommandName: "slots",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "wager",
          value: 100,
          type: ApplicationCommandOptionType.Integer
        }
      ]
    });
    await command.deferReply({ ephemeral: true });
    await handleCurrencySlots(
      {
        ...bot,
        env: { debugHook },
        db,
        cache: { wordGame: {}, slots: {} }
      } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    assert.equal(
      command.replies[0]?.content,
      "It would seem you do not have that much to wager."
    );
    assert.isTrue(command.ephemeral);
  });

  test("should not allow slots during word game", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "currency",
      subcommandName: "slots",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "wager",
          value: 100,
          type: ApplicationCommandOptionType.Integer
        }
      ]
    });
    await command.deferReply({ ephemeral: true });
    await handleCurrencySlots(
      {
        ...bot,
        env: { debugHook },
        db,
        cache: { wordGame: { [user.id]: true }, slots: {} }
      } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    assert.equal(
      command.replies[0]?.content,
      "It would seem you are still playing a word game. Please complete that first, before playing slots."
    );
    assert.isTrue(command.ephemeral);
  });

  test("should not allow slots within 5 minutes", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "currency",
      subcommandName: "slots",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "wager",
          value: 100,
          type: ApplicationCommandOptionType.Integer
        }
      ]
    });
    await command.deferReply({ ephemeral: true });
    await handleCurrencySlots(
      {
        ...bot,
        env: { debugHook },
        db,
        cache: {
          wordGame: {},
          slots: { [user.id]: { lastPlayed: Date.now() } }
        }
      } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    assert.equal(
      command.replies[0]?.content,
      "My oh my, it would seem you've become addicted to our slot machines. Give yourself a moment to breathe, and come play again in a few minutes."
    );
    assert.isTrue(command.ephemeral);
  });
});
