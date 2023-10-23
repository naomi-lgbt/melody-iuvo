import {
  ContextMenuCommandInteraction,
  ContextMenuCommandType
} from "discord.js";

import { ExtendedClient } from "./ExtendedClient";

export interface Context {
  data: {
    name: string;
    type: ContextMenuCommandType;
  };
  run: (
    bot: ExtendedClient,
    interaction: ContextMenuCommandInteraction
  ) => Promise<void>;
}
