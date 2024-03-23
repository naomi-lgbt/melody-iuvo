import { assert } from "chai";
import { MockRest } from "discordjs-testing";

import { ModerationCommands } from "../../src/config/ModerationCommands";
import { loadCommands } from "../../src/utils/loadCommands";
import { loadContexts } from "../../src/utils/loadContexts";
import { registerCommands } from "../../src/utils/registerCommands";

suite("registerCommands", () => {
  test("throws when bot is not authenticated", async () => {
    let threw = false;
    await registerCommands({} as never).catch(() => (threw = true));
    assert.isTrue(threw);
  });
  test("registers the command payload", async () => {
    const bot = {
      env: { token: "hi", homeGuild: "home" },
      user: { id: "user" },
      commands: [],
      contexts: []
    };
    await loadCommands(bot as never);
    await loadContexts(bot as never);
    const result = (await registerCommands(
      bot as never,
      MockRest as never
    )) as never as MockRest;
    assert.isNotNull(result);
    assert.lengthOf(result.requests, 1);
    const request = result.requests[0];
    assert.strictEqual(request.method, "PUT");
    assert.strictEqual(
      request.route,
      "/applications/user/guilds/home/commands"
    );
    assert.deepEqual(request.body, [
      // @ts-expect-error Not importing the typedef
      ...bot.commands.map((c) => c.data.toJSON()),
      // @ts-expect-error Not importing the typedef
      ...bot.contexts.map((c) => c.data),
      ...ModerationCommands.map((c) => c.toJSON())
    ]);
  });
});
