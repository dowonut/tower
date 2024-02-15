import _ from "lodash";
import { game, prisma, config, client } from "../../../tower.js";

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
    let input = playerArgs[i];

    // Format command arguments
    let commandArguments = game.formatCommandArguments(command, server, argument.name);

    //let commandText = displayCommand(commandArguments);
    let commandText = commandArguments;
    let errorContent: undefined | string;

    // Handle missing required type
    if (argument.required !== false && !input) {
      errorContent = `Missing required argument: **\`${argument.name}\`**`;
      error();
    }

    // Handle large input
    if (input && input.length > 100) {
      errorContent = `Input can't be longer than \`100\` characters.`;
      error();
    }

    // Format underscores
    if (argument?.type !== "user") input = input?.replaceAll("_", " ")?.toLowerCase();

    // if (!playerArgs[i]) continue;
    argsObject[argument.name] = input || undefined;

    // Handle argument type
    if (argument.type && input) {
      switch (argument.type) {
        //* Number type
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

        //* Number type defaults to 0
        case "numberZero":
          if (input == "all" || input == "a") argsObject[argument.name] = "all";
          // If argument isn't a number
          else if (isNaN(+input)) {
            errorContent = `Argument **\`${argument.name}\`** must be a number`;
            error();
          }
          // If number isn't above 0
          else if (+input < 0) {
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

        //* Strict number type
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

        //* Strict number type defaults to 0
        case "strictNumberZero":
          if (isNaN(+input)) {
            errorContent = `Argument **\`${argument.name}\`** must be a number`;
            error();
          } else if (+input < 0) {
            errorContent = `Argument **\`${argument.name}\`** cannot be less than 0`;
            error();
          } else if (+input >= 2147483647) {
            errorContent = `Number too large.`;
            error();
          }
          argsObject[argument.name] = parseInt(input);
          break;

        //* Must be a valid item in the game.
        case "item":
          const gameItem = game.getItem(input);
          if (!gameItem) {
            errorContent = `No item exists with name **\`${input}\`**`;
            error();
          }
          break;

        //* Must be a valid action in the game.
        case "playerAction":
          const action = await player.getAction(input);
          if (!action) {
            errorContent = `No action found with name **\`${input}\`**`;
            error();
          }
          argsObject[argument.name] = action;
          break;

        //* Must be the name of an item owned by the player
        case "playerOwnedItem":
          const playerItem = await player.getItem(input);
          if (!playerItem) {
            errorContent = `No item found with name **\`${input}\`**`;
            error();
          }
          argsObject[argument.name] = playerItem;
          break;

        //* Must be the name of an attack available to the player
        case "playerAvailableAttack":
          const attack = await player.getActions({
            onlyAvailable: true,
            name: input,
            type: "weapon_attack",
          });
          if (!attack[0]) {
            errorContent = `No attack found with name **\`${input}\`**`;
            error();
          }
          break;

        //* Must be the name of a dungeon available to the player
        case "playerAvailableDungeon":
          const exploration = player.exploration.filter(
            (x) => x.type == "dungeon" && x.floor == player.floor
          );
          if (_.isEmpty(exploration)) {
            errorContent = `You haven't located any dungeons on this floor.`;
            error();
          }
          const dungeon = exploration.find((x) => x.name == input);
          if (!dungeon) {
            errorContent = `No dungeon found with name **\`${input}\`**`;
            error();
          }
          break;

        //* Must be a merchant unlocked by the player
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

        //* Must be a valid command category
        case "commandCategory":
          if (!config.commandCategories.includes(input.toLowerCase() as CommandCategory)) {
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

        //* Must be a valid region
        case "region":
          const region = game.getRegion(player, input);
          if (!region) {
            errorContent = `No region found with name **\`${input}\`**\nSee available regions with \`${server.prefix}floor\``;
            error();
          }
          break;

        //* Must be a valid user in the game
        case "user":
          let discordId: string;
          if (input.startsWith("<@") && input.endsWith(">")) {
            discordId = input.slice(2, -1);
          } else if (!isNaN(+input)) {
            discordId = input;
          } else if (input == "me") {
            discordId = player.user.discordId;
          } else {
            const guildSearch = await client.guilds.fetch(player.guildId);
            const userSearch = await guildSearch.members.fetch({
              query: input,
              limit: 1,
            });
            if (userSearch.first()) {
              const discordUser = userSearch.first().user;
              discordId = discordUser.id;
            } else {
              errorContent = `No user found with name **\`${input}\`**`;
              error();
            }
          }

          const playerReference = await game.getPlayer({
            discordId,
            server,
            message: player.message,
            channel: player.channel,
          });
          if (!playerReference) {
            errorContent = `No user found with ID **\`${discordId}\`**`;
            error();
          } else {
            argsObject[argument.name] = playerReference;
          }
          break;

        //* Must be a valid target in combat
        case "target":
          if (!player.inCombat) {
            errorContent = `Targets can only be provided during combat.`;
            error();
          }
          const enemies = await player.getEnemies();
          const target = enemies?.find((x) => {
            return x.name == input.toLowerCase() || parseInt(input) == x.number;
          });
          if (!target) {
            errorContent = `No target found with number or name **\`${input}\`**`;
            error();
          } else {
            argsObject[argument.name] = target;
          }
          break;

        //* Must be a valid status effect
        case "statusEffect":
          const statusEffect = game.getStatusEffect(input);
          if (!statusEffect) {
            errorContent = `No status effect found with name **\`${input}\`**`;
            error();
          } else {
            argsObject[argument.name] = statusEffect;
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
        case "numberZero":
        case "strictNumberZero":
          argsObject[argument.name] = 0;
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
