import Discord, { TextChannel } from "discord.js";
import pkg from "@prisma/client";
import { PermissionsBitField } from "discord.js";
const ADMIN = PermissionsBitField.Flags.Administrator;

import { game, config, client, prisma } from "../../../tower.js";

/**
 * Execute a command on behalf of a user.
 */
export default async function runCommand(
  commandName: string,
  object: {
    /** Fetch player using Discord ID. */
    discordId?: string;
    /** Message required for channel and player information. */
    message: Message;
    server: Server;
    args?: string[];
  }
) {
  // Extract variables
  const { discordId, message, server, args = [] } = object;
  const userId = discordId || message.author.id;

  return new Promise(async (resolve) => {
    // Return if command isn't sent in guild text channel
    // if (message.channel.type !== Discord.ChannelType.GuildText) return;

    // Get command by name
    const command =
      client.commands.get(commandName) ||
      client.commands.find((cmd: Command) => cmd.aliases && cmd.aliases.includes(commandName));

    // Return if no command found
    if (!command) return; //throw new Error(`No command found by name ${commandName}`);

    // Create new collection if no cooldown found
    if (!client.cooldowns.has(command.name)) {
      client.cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = client.cooldowns.get(command.name);
    const cooldownAmount = (parseInt(command.cooldown) || 0) * 1000;

    // if (message) {
    //   // Check if user has permission to run the command
    //   const authorPerms =
    //     message.channel.permissionsFor(message.author) || new Map();

    //   // Check if user is admin
    //   if (command.category == "admin" && !authorPerms.has(ADMIN)) {
    //     return game.error({
    //       message,
    //       channel,
    //       content: `this command requires admin permissions.`,
    //     });
    //   }
    // }

    // Fetch player object
    let player: Player;
    if (discordId) {
      player = await game.getPlayer({ discordId, server });
    } else if (message) {
      player = await game.getPlayer({ message, server });
    } else {
      return game.error({
        content: `something went wrong trying to find player.`,
      });
    }

    // Override message author id for special cases
    message.user = player.user;

    // If command has no player requirement
    if (command.needChar == false) {
      return (command as CommandNoPlayer).execute(message, {}, player, server);
    }
    // Check if user has player character
    else if (!player) {
      return game.send({
        message,
        ping: true,
        content: `get started with \`${server.prefix}begin\``,
      });
    }
    // Make object null if no player data
    else if (player) {
      // Check if user is Dowonut
      if (command.dev && userId !== config.developerId) {
        return game.error({
          message,
          content: `this command is only for Dowonut. `,
        });
      }

      // Check if user is admin
      if (command.category == "admin" && player.user.discordId !== config.developerId) {
        return game.error({
          message,
          content: `this command requires admin permissions.`,
        });
      }

      // Check if command is unlocked
      if (!player.user.unlockedCommands.includes(command.name) && command.mustUnlock !== false) {
        return game.error({
          message,
          content: `you haven't unlocked this command yet.`,
        });
      }

      // Check if user is in combat
      if (player.inCombat == false && command.useInCombatOnly == true) {
        return game.error({
          message,
          content: `this command can only be used in combat.`,
        });
      }

      // Check if user is allowed to attack in combat
      if (player.canAttack == false && command.useInTurnOnly == true) {
        return game.error({
          message,
          content: `you can't do this right now.`,
        });
      }

      if (
        player.inCombat &&
        command.useInCombat !== true &&
        command.useInCombatOnly !== true &&
        command.category !== "admin"
      ) {
        return game.error({
          message,
          content: `this command can't be used while in combat.`,
        });
      }

      // Check party
      if (!player.party && command.partyOnly) {
        return game.error({
          message,
          content: `this command can only be used while in a party.`,
        });
      }

      // Check if the user is on cooldown for that command
      if (timestamps.has(userId) && userId !== config.developerId) {
        const expirationTime = timestamps.get(userId) + cooldownAmount;
        if (now < expirationTime) {
          return game.send({
            message,
            content: `:hourglass_flowing_sand: **${player.user.username}**, wait a moment before using this command again.`,
          });
        }
      }

      // Update command cooldown for user
      timestamps.set(userId, now);
      setTimeout(() => timestamps.delete(userId), cooldownAmount);

      // Try to run the command
      try {
        const parsedArgs = await game.parseCommandArguments({
          playerArgs: args,
          command,
          player,
          server,
        });
        const beforeCommand = Date.now();
        const response = await command.execute(message, parsedArgs, player, server);

        resolve(response || "SUCCESS");
        const afterCommand = Date.now();
        console.log(`> Command "${command.name}" executed in ${afterCommand - beforeCommand}ms`);
      } catch (object) {
        if (object instanceof game.cmdError) {
          const errorMessage = object.message;
          let errorTitle: string;
          switch (object.type) {
            case "argumentError":
              errorTitle = ""; //`❌ **Invalid arguments:**`;
              break;
            case "internalError":
              errorTitle = `⚠️ **Something went wrong...**`;
              break;
          }

          const messageContent = `${errorTitle}\n${errorMessage}`; //`${errorTitle}\`\`\`\n${errorMessage}\n\`\`\``;

          game.send({ reply: true, message, content: messageContent });
        } else {
          console.error(object);
        }
        resolve("ERROR");
      }
    }
  });
}
