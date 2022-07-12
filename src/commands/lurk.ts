import { performance } from "node:perf_hooks";
import { CommandArgs } from "..";

module.exports = {
  data: {
    name: "lurk",
    description:
      "Lie in wait in a place of concealment especially for an evil purpose.",
    lastUsed: 0,
    public: true,
  },
  execute: async function ({
    args,
    commands,
    config,
    lurkers,
    spotifyUserClient,
    twitchBotClient,
    user,
  }: CommandArgs) {
    const message = `┬┴┬┴┤ ͜ʖ ͡°) ├┬┴┬┴ ${user} is now lurking.`;

    await twitchBotClient.say(config.channel, message);

    lurkers[user] = user;

    this.data.lastUsed = performance.now();

    return message;
  },
};
