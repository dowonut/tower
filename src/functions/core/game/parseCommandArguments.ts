import { game, prisma, config } from "../../../tower.js";

export default async function parseCommandArguments(options: {
  playerArgs: string[];
  command: Command;
  player: Player;
  server: Server;
}) {
  const { playerArgs, command, player, server } = options;

  let argsObject: CommandParsedArguments = {};

  if (!Array.isArray(command.arguments)) return;

  // console.log("> INITIAL ARGS:", playerArgs);

  for (const [i, argument] of command.arguments.entries()) {
    const input = playerArgs[i];

    // Format command arguments
    let commandArguments = game.formatCommandArguments(
      command,
      server,
      argument.name
    );

    //let commandText = displayCommand(commandArguments);
    let commandText = commandArguments;
    let errorContent: undefined | string;

    // Handle missing required type
    if (argument.required !== false && !playerArgs[i]) {
      errorContent = `Missing required argument: **\`${argument.name}\`**`;
      error();
    }

    //if (!playerArgs[i]) continue;
    argsObject[argument.name] = input || undefined;

    // Handle argument type
    if (argument.type && input) {
      // Number type
      switch (argument.type) {
        case "number":
          // Set number to default of 1
          if (!input) argsObject[argument.name] = "1";
          else if (input == "all" || input == "a")
            argsObject[argument.name] = "all";
          // If argument isn't a number
          else if (isNaN(+input)) {
            errorContent = `Argument **\`${argument.name}\`** must be a number`;
            error();
          }
          // If number isn't above 0
          else if (+input <= 0) {
            errorContent = `Argument **\`${argument.name}\`** cannot be less than 0`;
            error();
          }
          break;

        // Must be the name of an item owned by the player
        case "playerOwnedItem":
          const item = await player.getItem(input);
          if (!item) {
            errorContent = `No item found with name **\`${input}\`**`;
            error();
          }
          break;

        // Must be the name of an attack available to the player
        case "playerAvailableAttack":
          const attack = await player.getAttack(input);
          if (!attack) {
            errorContent = `No attack found with name **\`${input}\`**`;
            error();
          }
          break;

        case "commandCategory":
          if (
            !config.commandCategories.includes(
              input.toLowerCase() as CommandCategory
            )
          ) {
            let commandCategories = config.commandCategories
              .filter((x) => x !== "admin")
              .map((x) => `\`${x}\``)
              .join(", ");
            errorContent = `**\`${input}\`** is not a valid command category.\nCategories: ${commandCategories}`;
            error();
          } else {
            argsObject[argument.name] = input.toLowerCase();
          }
          break;

        // Must be a valid user in the game
        case "user":
          let discordId: string;
          if (input.startsWith("<@") && input.endsWith(">")) {
            discordId = input.slice(2, -1);
          } else if (!isNaN(+input)) {
            discordId = input;
          } else {
            const userSearch = await prisma.user.findMany({
              where: { username: { equals: input, mode: "insensitive" } },
            });
            if (userSearch[0]) {
              discordId = userSearch[0].discordId;
            } else {
              errorContent = `No user found with username **\`${input}\`**`;
              error();
            }
          }
          console.log(discordId);

          const playerReference = await game.getPlayer({ discordId, server });
          if (!playerReference) {
            errorContent = `No user found with ID **\`${discordId}\`**`;
            error();
          } else {
            argsObject[argument.name] = playerReference;
          }
          break;
      }
    }

    // Handle filter
    if (argument.filter) {
      let result = await argument.filter(input, player, argsObject);
      if (!result.success) {
        errorContent = result.message;
        error();
      }
      if (result.content) {
        argsObject[argument.name] = result.content;
      }
    }

    /**
     * Function to stop and throw error.
     */
    function error() {
      throw new game.cmdError({
        type: "argumentError",
        message: commandText + "❌ " + errorContent,
      });
    }
  }

  // console.log("> PARSED ARGS:", argsObject);

  return argsObject;

  /**
   * Create formatted text showing command and arguments.
   */
  // function displayCommand(commandArguments: any) {
  //   return `\`${server.prefix}${command.name}\` ${commandArguments}\n`;
  // }
}
