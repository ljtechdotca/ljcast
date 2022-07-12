import { performance } from "node:perf_hooks";
import { CommandArgs } from "..";

module.exports = {
  data: {
    name: "so",
    description: "Publicly acknowledge a supportive Twitch channel.",
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
    const option = args[0];

    const message = `Go check out and follow ${option} @ https://www.twitch.tv/${option}!`;

    await twitchBotClient.say(config.channel, message);

    this.data.lastUsed = performance.now();

    return message;
  },
};
