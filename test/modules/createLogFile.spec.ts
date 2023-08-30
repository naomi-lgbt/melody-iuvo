import { readFile, stat, unlink } from "fs/promises";
import { join } from "path";

import { assert } from "chai";

import { createLogFile } from "../../src/modules/createLogFile";

suite("createLogFile", () => {
  test("should create the file", async () => {
    await createLogFile({ ticketLogs: {} } as never, "channel", "user", "test");
    const path = join(process.cwd(), "logs", "channel.txt");
    const status = await stat(path);
    assert.isTrue(status.isFile());
    const contents = await readFile(path, "utf-8");
    assert.match(contents, /TICKET CREATED/);
    assert.match(contents, /- user: test/);
    await unlink(path);
  });
});
