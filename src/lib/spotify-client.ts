import chalk from "chalk";
import fs from "fs";
import path from "path";

export interface SpotifyConfig {
  clientId: string;
  clientSecret: string;
}

class SpotifyClient {
  config: SpotifyConfig;
  initialToken: Record<string, any>;

  constructor(config: SpotifyConfig, initialToken: Record<string, any>) {
    this.config = config;
    this.initialToken = initialToken;

    this.refresh();
  }

  async refresh() {
    const url = new URL("https://accounts.spotify.com/api/token");
    url.search = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: this.initialToken.refresh_token,
    }).toString();

    const options = {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            this.config.clientId + ":" + this.config.clientSecret
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (response.status === 200) {
      this.initialToken = {
        ...this.initialToken,
        ...data,
      };

      fs.writeFileSync(
        path.resolve(".", "data", "tokens", "spotify-user.json"),
        JSON.stringify(this.initialToken, null, 4),
        "utf-8"
      );
    } else {
      console.log(data);
    }
  }

  private async getCurrentlyPlaying() {
    const url = new URL(
      "https://api.spotify.com/v1/me/player/currently-playing"
    );

    const options = {
      headers: {
        Authorization: "Bearer " + this.initialToken.access_token,
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, options);

    const data = await response.json();

    if (data.error) {
      throw new Error(chalk.red(data.error.message));
    }

    const {
      item: { artists, name },
    } = data;

    return `🎶 Currently playing: ${artists[0].name} - ${name}`;
  }

  async song() {
    try {
      return await this.getCurrentlyPlaying();
    } catch (error) {
      try {
        await this.refresh();
        return await this.getCurrentlyPlaying();
      } catch (error) {
        console.error(error);
      }
    }
  }
}

export default SpotifyClient;
