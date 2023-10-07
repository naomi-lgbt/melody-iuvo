export interface SteamGame {
  appid: number;
  playtime_forever: number;
  playtime_windows_forever: number;
  playtime_mac_forever: number;
  playtime_linux_forever: number;
  rtime_last_played: number;
  playtime_disconnected: number;
}

export interface SteamResponse {
  response: {
    gameCount: number;
    games: SteamGame[];
  };
}
