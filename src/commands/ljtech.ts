import { performance } from "node:perf_hooks";
import { CommandArgs } from "..";

module.exports = {
  data: {
    name: "ljtech",
    description: "Links the official ljtechdotca website.",
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
    const message = `🧶 Check out my personal website: ${config.website}`;

    await twitchBotClient.announce(config.channel, message);

    this.data.lastUsed = performance.now();

    return message;
  },
};
