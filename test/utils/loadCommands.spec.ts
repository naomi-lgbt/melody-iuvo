import { readdir } from "fs/promises";
import { join } from "path";

import { assert } from "chai";

import { Command } from "../../src/interfaces/Command";
import { loadCommands } from "../../src/utils/loadCommands";

suite("loadCommands", () => {
  const bot: { commands: Command[] } = { commands: [] };
  test("Should read all of the commands", async () => {
    const commandFiles = await readdir(join(process.cwd(), "src", "commands"));
    const commandNames = commandFiles.map((file) => file.split(".")[0]);
    await loadCommands(bot as never);
    assert.equal(bot.commands.length, commandNames.length);
    for (const name of commandNames) {
      assert.exists(
        bot.commands.find(
          (command) =>
            command.data.name
              .split("-")
              .reduce(
                (acc, el, i) =>
                  i === 0
                    ? acc + el
                    : acc +
                      (el[0].toUpperCase() + el.substring(1).toLowerCase()),
                ""
              ) === name
        )
      );
    }
  });
});
