import { assert } from "chai";

import { Command } from "../src/interfaces/Command";
import { loadCommands } from "../src/utils/loadCommands";

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
