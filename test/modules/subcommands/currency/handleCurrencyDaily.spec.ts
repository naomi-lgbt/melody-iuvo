import { assert } from "chai";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import {
  MockChannel,
  MockChatInputCommandInteraction,
  MockGuild,
  MockMember,
  MockUser,
  MockWebhook,
} from "discordjs-testing";

import { CurrencyDailyEvents } from "../../../../src/config/Currency";
import { handleCurrencyDaily } from "../../../../src/modules/subcommands/currency/handleCurrencyDaily";
import { Database } from "../../../__mocks__/Database.mock";

const db = new Database();
const guild = new MockGuild({
  name: "Test Guild",
});
const bot = new MockUser({
  username: "Test Bot",
  avatar: "test",
  discriminator: 1234,
  bot: true,
  system: false,
});
const user = new MockUser({
  username: "Test User",
  avatar: "test",
  discriminator: 1234,
  bot: false,
  system: false,
});
const member = new MockMember({
  guild,
  user,
});
const channel = new MockChannel({
  name: "test-channel",
  guild,
  type: ChannelType.GuildText,
});
const debugHook = new MockWebhook({
  channel,
  user: bot,
});

suite("handleCurrencyDaily", () => {
  test("should not allow an event while word game is active", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "currency",
      subcommandName: "daily",
      guild,
      bot,
      user,
      member,
      channel,
    });
    await command.deferReply({ ephemeral: true });
    await handleCurrencyDaily(
      {
        ...bot,
        env: { debugHook },
        db,
        cache: { wordGame: { [user.id]: {} } },
      } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    assert.equal(
      command.replies[0]?.content,
      "It would seem you are still playing a word game. Please complete that first, before doing your daily event."
    );
    assert.isTrue(command.ephemeral);
  });

  test("should properly run daily event", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "currency",
      subcommandName: "daily",
      guild,
      bot,
      user,
      member,
      channel,
    });
    await command.deferReply({ ephemeral: true });
    await handleCurrencyDaily(
      { ...bot, env: { debugHook }, db, cache: { wordGame: {} } } as never,
      command.typeCast()
    );
    assert.equal(command.replies.length, 1);
    const triggeredEvent = CurrencyDailyEvents.find((e) =>
      command.replies[0]?.content?.startsWith(`# ${e.title}`)
    );
    const regex = new RegExp(
      `# ${triggeredEvent?.title}\n${triggeredEvent?.description}\nYou (?:gained|lost) \\d+ NaomiCoin`
    );
    assert.match(command.replies[0]?.content || "", regex);
    assert.isTrue(command.ephemeral);
  });

  test("should not allow second daily within 24 hours", async () => {
    const command = new MockChatInputCommandInteraction({
      commandName: "currency",
      subcommandName: "daily",
      guild,
      bot,
      user,
      member,
      channel,
      options: [
        {
          name: "target",
          value: "bio-slot",
          type: ApplicationCommandOptionType.String,
        },
      ],
    });
    await command.deferReply({ ephemeral: true });
    await handleCurrencyDaily(
      { ...bot, env: { debugHook }, db, cache: { wordGame: {} } } as never,
      command.typeCast()
    );
    assert.strictEqual(
      command.replies[0]?.content,
      "It would seem you have already done your daily event. Please try again later."
    );
  });
});
