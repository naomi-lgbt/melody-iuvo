import { ExtendedClient } from "./ExtendedClient";
import { GuildButton } from "./GuildButton";

export type ButtonHandler = (
  Bot: ExtendedClient,
  interaction: GuildButton
) => Promise<void>;
