import Discord from "discord.js";
import pkg from "@prisma/client";
import { PermissionsBitField } from "discord.js";
const ADMIN = PermissionsBitField.Flags.Administrator;

import { game, config, client, prisma } from "../../../tower.js";

/**
 * Execute a command on behalf of a user.
 */
export default async function runCommand(
  commandName: string,
  object: { message: Message; server: Server; args?: string[] }
): Promise<void> {
  // Extract variables
  const { message, server, args = [] } = object;

  return new Promise(async (resolve) => {
    // Return if command isn't sent in guild text channel
    if (message.channel.type !== Discord.ChannelType.GuildText) return;

    // Get command by name
    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        (cmd: Command) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    // Return if no command found
    if (!command) return; //console.error(`No command found by name: ${commandName}`);

    // Create new collection if no cooldown found
    if (!client.cooldowns.has(command.name)) {
      client.cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = client.cooldowns.get(command.name);
    const cooldownAmount = (parseInt(command.cooldown) || 0) * 1000;

    // Check if user has permission to run the command
    const authorPerms =
      message.channel.permissionsFor(message.author) || new Map();
    // if (command.permissions) {
    //   if (!authorPerms || !authorPerms.has(command.permissions)) {
    //     return game.error({
    //       message,
    //       content: "you're not worthy of this command.",
    //     });
    //   }
    // }

    // Fetch player object
    let player = await game.getPlayer({ message, server });

    // If command has no player requirement
    if (command.needChar == false) {
      return (command as CommandNoPlayer).execute(message, [], player, server);
    }
    // Check if user has player character
    else if (command.needChar && !player) {
      return game.send({
        message,
        ping: true,
        content: `get started with \`${server.prefix}begin\``,
      });
    }
    // Make object null if no player data
    else if (player) {
      // Check if user is admin
      if (command.category == "admin" && !authorPerms.has(ADMIN)) {
        return game.error({
          message,
          content: `this command requires admin permissions.`,
        });
      }

      // Check if command is unlocked
      if (
        !player.unlockedCommands.includes(command.name) &&
        !authorPerms.has(ADMIN)
      ) {
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
      if (player.canAttack == false && command.useInCombatOnly == true) {
        return game.error({ message, content: `you can't do this right now.` });
      }

      if (
        player.inCombat == true &&
        command.useInCombat !== true &&
        command.useInCombatOnly !== true &&
        command.category !== "admin"
      ) {
        return game.error({
          message,
          content: `this command can't be used while in combat.`,
        });
      }

      // Check if the user is on cooldown for that command
      if (timestamps.has(message.author.id)) {
        const expirationTime =
          timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
          return game.send({
            message,
            content: `:hourglass_flowing_sand: **${message.author.username}**, wait a moment before using this command again.`,
          });
        }
      }

      // Update command cooldown for user
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

      // Try to run the command
      try {
        //const beforeCommand = Date.now();
        resolve(command.execute(message, args, player, server));
        //const afterCommand = Date.now();
        // console.log(
        //   `command ${command.name} executed in ${
        //     afterCommand - beforeCommand
        //   }ms`
        // );
      } catch (error) {
        resolve(console.error("Something went wrong: ", error));
      }
    }
  });
}
