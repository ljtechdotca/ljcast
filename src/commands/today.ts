import fs from "fs";
import { performance } from "node:perf_hooks";
import path from "path";
import { CommandArgs } from "..";

const todayPath = path.resolve(".", "data", "today.txt");

module.exports = {
  data: {
    name: "today",
    description: "Reveals the todays stream details.",
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
    let message;

    if (!fs.existsSync(todayPath)) {
      message = "Nothing is happening right now. (╯°□°）╯︵ ┻━┻";
      fs.writeFileSync(todayPath, message, "utf-8");
    } else {
      message = fs.readFileSync(todayPath, "utf-8");
    }

    await twitchBotClient.say(config.channel, message);

    this.data.lastUsed = performance.now();

    return message;
  },
};
