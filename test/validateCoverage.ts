import { readdir, stat } from "fs/promises";
import { join } from "path";

import { logHandler } from "../src/utils/logHandler";

const loadDirectory = async (path: string): Promise<string[]> => {
  const files: string[] = [];
  const status = await stat(path);
  if (status.isDirectory()) {
    const filesInDir = await readdir(path);
    for (const file of filesInDir) {
      files.push(...(await loadDirectory(join(path, file))));
    }
  } else {
    files.push(path);
  }
  return files;
};

(async () => {
  const src = await loadDirectory(join(process.cwd(), "src"));
  const test = await loadDirectory(join(process.cwd(), "test"));
  const filesUntested = src.filter(
    (file) =>
      // exclude files in the src/interface directory as types do not need testing
      !/src\/interface/.test(file) &&
      !test.includes(file.replace("src", "test").replace(".ts", ".spec.ts"))
  );
  if (filesUntested.length) {
    logHandler.error(
      `The following files do not have a corresponding spec:\n${filesUntested.join(
        "\n"
      )}`
    );
    process.exit(1);
  }
})();
