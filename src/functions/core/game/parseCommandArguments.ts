import { game, prisma, config } from "../../../tower.js";

export default async function parseCommandArguments(options: {
  playerArgs: string[];
  command: Command;
  player: Player;
  server: Server;
}) {
  const { command, player, server } = options;
  let { playerArgs } = options;

  let argsObject: CommandParsedArguments = {};

  // Check if command has arguments
  if (!Array.isArray(command.arguments)) return;

  // Allow spaces for commands with one argument
  if (command.arguments.length == 1) playerArgs = [playerArgs.join(" ")];

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

    // if (!playerArgs[i]) continue;
    argsObject[argument.name] = input || undefined;

    // Handle argument type
    if (argument.type && input) {
      switch (argument.type) {
        case "number":
          if (input == "all" || input == "a") argsObject[argument.name] = "all";
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
          // If above 32 bit integer limit
          else if (+input >= 2147483647) {
            errorContent = `Number too large.`;
            error();
          } else {
            argsObject[argument.name] = parseInt(input);
          }
          break;

        // Strict number type
        case "strictNumber":
          if (isNaN(+input)) {
            errorContent = `Argument **\`${argument.name}\`** must be a number`;
            error();
          } else if (+input <= 0) {
            errorContent = `Argument **\`${argument.name}\`** cannot be less than 0`;
            error();
          } else if (+input >= 2147483647) {
            errorContent = `Number too large.`;
            error();
          }
          argsObject[argument.name] = parseInt(input);
          break;

        // Must be a valid item in the game.
        case "item":
          const gameItem = game.getItem(input);
          if (!gameItem) {
            errorContent = `No item exists with name **\`${input}\`**`;
            error();
          }
          break;

        // Must be the name of an item owned by the player
        case "playerOwnedItem":
          const playerItem = await player.getItem(input);
          if (!playerItem) {
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

        // Must be a merchant unlocked by the player
        case "playerAvailableMerchant":
          const merchantErrorMessage = `No merchant found with name or category **\`${input}\`**`;
          const merchant = game.getMerchant(input);
          if (!merchant) {
            errorContent = merchantErrorMessage;
            error();
          }
          const playerMerchants = await player.getUnlockedMerchants();
          const overlap = playerMerchants.find((x) => x.name == merchant.name);
          if (!overlap) {
            errorContent = merchantErrorMessage;
            error();
          }
          break;

        // Must be a valid command category
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

        // Must be a valid region
        case "region":
          const region = game.getRegion(player, input);
          if (!region) {
            errorContent = `No region found with name **\`${input}\`**\nSee available regions with \`${server.prefix}floor\``;
            error();
          }
          break;

        // Must be a valid user in the game
        case "user":
          let discordId: string;
          if (input.startsWith("<@") && input.endsWith(">")) {
            discordId = input.slice(2, -1);
          } else if (!isNaN(+input)) {
            discordId = input;
          } else if (input == "me") {
            discordId = player.user.discordId;
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

    // Handle defaults
    if (argument.type && !input) {
      switch (argument.type) {
        case "number":
        case "strictNumber":
          argsObject[argument.name] = 1;
          break;
      }
    }

    // Handle filter
    if (argument.filter && input) {
      let result = await argument.filter(input, player, argsObject);
      if (!result.success) {
        errorContent = result.message as string;
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
        message: config.emojis.error + " " + errorContent + "\n" + commandText,
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
