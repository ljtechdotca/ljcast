import { performance } from "node:perf_hooks";
import { CommandArgs } from "..";

module.exports = {
  data: {
    name: "unlurk",
    description: "Return from concealment with no evil intentions.",
    lastUsed: 0,
    public: true,
  },
  execute: async function ({
    args,
    config,
    commands,
    lurkers,
    spotifyUserClient,
    twitchBotClient,
    user,
  }: CommandArgs) {
    const message = `༼ つ ◕_◕ ༽つ ${user} has returned.`;

    await twitchBotClient.say(config.channel, message);

    delete lurkers[user];

    this.lastUsed = performance.now();

    return message;
  },
};
