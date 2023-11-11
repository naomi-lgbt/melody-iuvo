import { assert } from "chai";

import { Command } from "../src/interfaces/Command";
import { loadCommands } from "../src/utils/loadCommands";
import { loadContexts } from "../src/utils/loadContexts";
import { Context } from "../src/interfaces/Context";

suite("command data", () => {
  test("should all be set to DMs false", async () => {
    const bot: { commands: Command[] } = { commands: [] };
    await loadCommands(bot as never);
    for (const command of bot.commands) {
      assert.isFalse(
        command.data.dm_permission,
        `${command.data.name} is permitted in DMs!`
      );
    }
  });
});

suite("context data", () => {
  test("should all be set to DMs false", async () => {
    const bot: { contexts: Context[] } = { contexts: [] };
    await loadContexts(bot as never);
    for (const command of bot.contexts) {
      assert.isFalse(
        command.data.dm_permission,
        `${command.data.name} is permitted in DMs!`
      );
    }
  });
});
