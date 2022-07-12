function isValidCommand(commands: Record<string, any>, message: string) {
  let command: boolean | { args: string[]; name: string } = false;
  if (message.startsWith("!")) {
    const words = message.split(" ");
    const args = words.slice(1);
    const name = words[0].slice(1);
    if (commands[name]) {
      command = { args, name };
    }
  }
  return command;
}

export default isValidCommand;
