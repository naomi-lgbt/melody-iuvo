import { assert } from "chai";

import { Intents } from "../../src/config/Intents";

suite("Intents", () => {
  test("Uses the correct intent options", () => {
    assert.include(Intents, 1, "Missing Guilds intent.");
    assert.include(Intents, 512, "Missing GuildMessages intent.");
    assert.include(Intents, 2, "Missing GuildMembers intent.");
    assert.include(Intents, 32768, "Missing MessageContent intent.");
    assert.include(Intents, 2097152, "Missing AutoModerationExecution intent.");
    assert.include(Intents, 128, "Missing GuildVoiceStates intent.");
  });
});
