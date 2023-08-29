import { EmbedBuilder } from "discord.js";

import { ExtendedClient } from "./ExtendedClient";

export type AssetTarget =
  | "naomi"
  | "becca"
  | "rosalia"
  | "beccalia"
  | "novas"
  | "melody";

export type AssetType =
  | "adventures"
  | "emotes"
  | "outfits"
  | "portraits"
  | "poses";

export type AssetResponseType =
  | Adventure[]
  | Emote[]
  | Outfit[]
  | Portrait[]
  | string[];

export type AssetHandler = (
  bot: ExtendedClient,
  target: AssetTarget,
  test?: boolean
) => Promise<EmbedBuilder>;

export interface Adventure {
  fileName: string;
  game: string;
  alt: string;
  description: string;
}

export interface Emote {
  fileName: string;
  name: string;
  alt: string;
  description: string;
}

export interface Outfit {
  name: string;
  fileName: string;
  description: string;
  alt: string;
  credits: {
    [key: string]: string;
  };
}

export interface Portrait {
  fileName: string;
  name: string;
  artist: string;
  url: string;
  alt: string;
  description: string;
}

export interface Pose {
  fileName: string;
  name: string;
  alt: string;
  description: string;
}
