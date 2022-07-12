import { performance } from "node:perf_hooks";
import { CommandArgs } from "..";

module.exports = {
  data: {
    name: "drop",
    description: "Drop an emoji with or without a parachute.",
    lastUsed: -90000,
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
    const message = "!drop catJAM";

    if (performance.now() - this.data.lastUsed > 90000) {
      await twitchBotClient.say(config.channel, message);

      this.data.lastUsed = performance.now();

      return message;
    }
  },
};
