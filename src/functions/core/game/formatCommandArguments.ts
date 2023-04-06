/** Format command argument for error handling. */
export default function formatCommandArguments(
  command: Command,
  server: Server,
  highlightArgument: string = ""
) {
  let commandArguments = command.arguments
    .map((x) => {
      let text = `${x.name}`;
      if (x.required !== false) {
        text = `<${text}>`;
      } else {
        text = `[${text}]`;
      }
      text = `${text}`;
      if (x.name == highlightArgument) text = `\u001b[1;2;31m${text}\u001b[0m`;
      return text;
    })
    .join(" ");

  commandArguments = `\`\`\`ansi\n${server.prefix}${command.name} ${commandArguments}\n\`\`\``;

  return commandArguments;
}
