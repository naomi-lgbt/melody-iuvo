import SpotifyWebApi from "spotify-web-api-node";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";
import { getRandomValue } from "../utils/getRandomValue";

/**
 * Fetches a public playlist from Spotify, paginates through the tracks,
 * then posts it to Discord.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const getSpotifySong = async (bot: ExtendedClient): Promise<void> => {
  try {
    const spotify = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_ID,
      clientSecret: process.env.SPOTIFY_SECRET
    });
    const tokenRequest = await spotify.clientCredentialsGrant();
    spotify.setAccessToken(tokenRequest.body["access_token"]);
    const tracks: SpotifyApi.PlaylistTrackObject[] = [];
    let playlist = await spotify.getPlaylistTracks("7Dl21fE8To9o6CPeBbChf6");
    tracks.push(...playlist.body.items);
    let next = playlist.body.next;
    while (next) {
      const offsetString = new URLSearchParams(new URL(next).search).get(
        "offset"
      );
      if (!offsetString) {
        break;
      }
      const offset = parseInt(offsetString, 10);
      playlist = await spotify.getPlaylistTracks("7Dl21fE8To9o6CPeBbChf6", {
        offset
      });
      tracks.push(...playlist.body.items);
      next = playlist.body.next;
    }
    const track = getRandomValue(tracks);
    if (!track.track) {
      await bot.env.debugHook.send("Failed to get track data from playlist.");
      return;
    }
    const title = track.track.name;
    const artist = track.track.artists.map((a) => a.name).join(", ");
    const link = track.track.external_urls.spotify;
    const explicit = track.track.explicit;
    const content = explicit
      ? `Today's song of the day is: ||[**${title}** by ${artist}](<${link}>).||\nPlease note that this track is marked as explicit on Spotify, but I cannot tell why.`
      : `Today's song of the day is: [**${title}** by ${artist}](${link}).`;
    await bot.discord.channels.general?.send({
      content
    });
  } catch (err) {
    await errorHandler(bot, "get spotify song", err);
  }
};
