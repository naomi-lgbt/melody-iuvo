import { readdir } from "fs/promises";
import { join } from "path";

import { assert } from "chai";

import { Context } from "../../src/interfaces/Context";
import { loadContexts } from "../../src/utils/loadContexts";

suite("loadContexts", () => {
  const bot: { contexts: Context[] } = { contexts: [] };
  test("Should read all of the contexts", async () => {
    const contextFiles = await readdir(join(process.cwd(), "src", "contexts"));
    const contextNames = contextFiles.map((file) => file.split(".")[0]);
    await loadContexts(bot as never);
    assert.equal(bot.contexts.length, contextNames.length);
    for (const name of contextNames) {
      assert.exists(bot.contexts.find((context) => context.data.name === name));
    }
  });
});
