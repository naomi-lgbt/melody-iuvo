import { readdir } from "fs/promises";
import { join } from "path";

import { Context } from "../interfaces/Context";
import { ExtendedClient } from "../interfaces/ExtendedClient";

import { errorHandler } from "./errorHandler";

/**
 * Reads the `/contexts` directory and dynamically imports the files,
 * then pushes the imported data to an array. Mounts that array to the Melody.
 *
 * @param {ExtendedClient} Melody The Melody's Discord instance.
 */
export const loadContexts = async (Melody: ExtendedClient): Promise<void> => {
  try {
    const result: Context[] = [];
    const files = await readdir(
      join(process.cwd(), "prod", "contexts"),
      "utf-8"
    );
    for (const file of files) {
      const name = file.split(".")[0];
      if (!name) {
        continue;
      }
      const mod = await import(join(process.cwd(), "prod", "contexts", file));
      result.push(mod[name] as Context);
    }
    Melody.contexts = result;
  } catch (err) {
    await errorHandler(Melody, "slash command loader", err);
  }
};
