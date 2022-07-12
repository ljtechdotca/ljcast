import { performance } from "node:perf_hooks";
import { CommandArgs } from "..";

module.exports = {
  data: {
    name: "song",
    description: "Links the currently playing track from Spotify.",
    lastUsed: 0,
    public: true,
  },
  execute: async function ({
    args,
    config,
    commands,
    spotifyUserClient,
    twitchBotClient,
    user,
  }: CommandArgs) {
    const message = await spotifyUserClient.song();

    if (message) {
      await twitchBotClient.say(config.channel, message);

      this.data.lastUsed = performance.now();

      return message;
    }
  },
};
