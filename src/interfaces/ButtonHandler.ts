import { ExtendedClient } from "./ExtendedClient";
import { GuildButton } from "./GuildButton";

export type ButtonHandler = (
  Melody: ExtendedClient,
  interaction: GuildButton
) => Promise<void>;
