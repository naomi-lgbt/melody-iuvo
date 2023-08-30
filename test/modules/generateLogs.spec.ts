import { assert } from "chai";
import { AttachmentBuilder } from "discord.js";

import { createLogFile } from "../../src/modules/createLogFile";
import { generateLogs } from "../../src/modules/generateLogs";

suite("generateLogs", () => {
  test("should generate an attachment", async () => {
    await createLogFile({ ticketLogs: {} } as never, "channel", "user", "test");
    const result = await generateLogs({ ticketLogs: {} } as never, "channel");
    assert.instanceOf(result, AttachmentBuilder);
    const string = result.attachment.toString();
    assert.match(string, /\*\*TICKET CREATED\*\*/);
    assert.match(string, /- user: test/);
  });

  test("should handle errors", async () => {
    const result = await generateLogs({ ticketLogs: {} } as never, "channel");
    assert.instanceOf(result, AttachmentBuilder);
    const string = result.attachment.toString();
    assert.match(string, /no logs found\.\.\./);
  });
});
