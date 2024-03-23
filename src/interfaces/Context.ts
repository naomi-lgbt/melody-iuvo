import {
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction
} from "discord.js";

import { ExtendedClient } from "./ExtendedClient";

export interface Context {
  data: ContextMenuCommandBuilder;
  run: (
    Melody: ExtendedClient,
    interaction: ContextMenuCommandInteraction
  ) => Promise<void>;
}
