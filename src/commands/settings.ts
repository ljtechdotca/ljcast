import { performance } from "node:perf_hooks";
import { CommandArgs } from "..";

module.exports = {
  data: {
    name: "settings",
    description:
      "Links ljtechdotca's Visual Studio extensions and settings gist snippet.",
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
    const message = `🛸 Extensions and settings: ${config.vscodeSettings}`;

    await twitchBotClient.say(config.channel, message);

    this.data.lastUsed = performance.now();

    return message;
  },
};
