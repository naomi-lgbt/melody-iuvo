import {
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction
} from "discord.js";

import { ExtendedClient } from "./ExtendedClient";

export interface Context {
  data: ContextMenuCommandBuilder;
  run: (
    bot: ExtendedClient,
    interaction: ContextMenuCommandInteraction
  ) => Promise<void>;
}
