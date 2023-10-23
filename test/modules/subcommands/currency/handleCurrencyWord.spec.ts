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

import { handleCurrencyWord } from "../../../../src/modules/subcommands/currency/handleCurrencyWord";
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

suite("handleCurrencyWord", () => {
  test("should not allow a wager of more than the balance", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "currency",
      subcommandName: "word",
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
    await handleCurrencyWord(
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

  test("should not allow a new game during word game", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "currency",
      subcommandName: "word",
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
    await db.users.upsert({
      where: {
        userId: user.id
      },
      create: {
        userId: user.id,
        currency: {
          copper: 21,
          silver: 39,
          gold: 5,
          platinum: 0,
          amethyst: 0
        }
      },
      update: {
        currency: {
          copper: 21,
          silver: 39,
          gold: 5,
          platinum: 0,
          amethyst: 0
        }
      }
    });
    await handleCurrencyWord(
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
      "It would seem you are already playing one of these."
    );
    assert.isTrue(command.ephemeral);
  });

  test("should provide a word game", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "currency",
      subcommandName: "word",
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
    await db.users.upsert({
      where: {
        userId: user.id
      },
      create: {
        userId: user.id,
        currency: {
          copper: 21,
          silver: 39,
          gold: 5,
          platinum: 0,
          amethyst: 0
        }
      },
      update: {
        currency: {
          copper: 21,
          silver: 39,
          gold: 5,
          platinum: 0,
          amethyst: 0
        }
      }
    });
    await handleCurrencyWord(
      {
        ...bot,
        env: { debugHook },
        db,
        cache: {
          wordGame: {},
          slots: {}
        }
      } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    assert.equal(
      command.replies[0]?.content,
      "You have five guesses to guess this 5-letter word. Letters will be yellow if they are in the word, but not in the correct position. Letters will be green if they are in the correct position. Good luck~!"
    );
    assert.isTrue(command.ephemeral);
  });
});
