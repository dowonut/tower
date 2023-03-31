import { game } from "../../../tower.js";

export default async function parseCommandArguments(options: {
  playerArgs: string[];
  command: CommandTemp | Command;
  player: Player;
  server: Server;
}) {
  const { playerArgs, command, player, server } = options;

  if (!Array.isArray(command.arguments)) return;

  console.log(playerArgs);

  for (const [i, argument] of command.arguments.entries()) {
    const input = playerArgs[i];

    // Format command arguments
    let commandArguments = game.formatCommandArguments(
      command.arguments,
      argument.name
    );

    let commandText = displayCommand(commandArguments);
    let errorContent: undefined | string;

    // Handle missing required type
    if (argument.required !== false && !playerArgs[i]) {
      errorContent = `Missing required argument: **\`${argument.name}\`**`;
      error();
    }

    if (!playerArgs[i]) continue;

    // Handle argument type
    if (argument.type) {
      // Number type
      if (argument.type == "number") {
        // If argument isn't a number
        if (isNaN(+input)) {
          errorContent = `Argument **\`${argument.name}\`** must be a number.`;
          error();
        }
        // If number isn't above 0
        else if (+input <= 0) {
          errorContent = `Argument **\`${argument.name}\`** cannot be less than 0.`;
          error();
        }
      }
    }

    // Handle filter
    if (argument.filter) {
      let result = await argument.filter(input, player, playerArgs);
      if (!result.success) {
        errorContent = result.message;
        error();
      }
    }

    /**
     * Function to stop and throw error.
     */
    function error() {
      throw new game.cmdError({
        type: "argumentError",
        message: commandText + "└ " + errorContent,
      });
    }
  }

  /**
   * Create formatted text showing command and arguments.
   */
  function displayCommand(commandArguments: any) {
    return `\`${server.prefix}${command.name}\` ${commandArguments}\n`;
  }
}
