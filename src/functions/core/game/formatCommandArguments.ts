/** Format command argument for error handling. */
export default function formatCommandArguments(
  inputArguments: CommandArgument[],
  highlightArgument: string = ""
) {
  let commandArguments = inputArguments
    .map((x) => {
      let text = `${x.name}`;
      if (x.required) {
        text = `<${text}>`;
      } else {
        text = `[${text}]`;
      }
      text = `\`${text}\``;
      if (x.name == highlightArgument) text = `**${text}**`;
      return text;
    })
    .join(" ");

  return commandArguments;
}
