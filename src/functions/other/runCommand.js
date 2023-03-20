import Discord from "discord.js";
import pkg from "@prisma/client";
import { PermissionsBitField } from "discord.js";
const ADMIN = PermissionsBitField.Flags.Administrator;

import { game, config, client, prisma } from "../../tower.js";

/**
 * Execute a command on behalf of a user.
 * @param {object} object
 * @param {string} object.commandName - Name of command.
 * @param {Array<string>} object.args - Command arguments.
 * @param {Discord.Message} object.message - User message object.
 * @param {object} object.server - Current server object.
 * @param {Discord.Collection} object.commands - Commands collection.
 * @param {Discord.Collection} object.cooldowns - Cooldowns collection.
 * @returns Nothing
 */
export default async function runCommand(object) {
  // Extract variables
  const { commandName, message, server, commands, cooldowns, args } = object;

  return new Promise(async (resolve) => {
    // Return if command isn't sent in guild text channel
    if (message.channel.type !== Discord.ChannelType.GuildText) return;

    // Get command by name
    const command =
      commands.get(commandName) ||
      commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    // Return if no command found
    if (!command) return;

    // Create new collection if no cooldown found
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 0) * 1000;

    // Check if user has permission to run the command
    const authorPerms =
      message.channel.permissionsFor(message.author) || new Map();
    if (command.permissions) {
      if (!authorPerms || !authorPerms.has(command.permissions)) {
        return game.error("you're not worthy of this command.");
      }
    }

    // Fetch player object
    let player = await game.getPlayer({ message, server, prisma });

    // Check if user has player character
    if (command.needChar !== false && !player) {
      return game.reply(message, `get started with \`${server.prefix}begin\``);
    }

    // Make object null if no player data
    if (player) {
      // Check if user is admin
      if (command.category == "Admin" && !authorPerms.has(ADMIN)) {
        return game.error(message, `this command requires admin permissions.`);
      }

      // Check if command is unlocked
      if (
        !player.unlockedCommands.includes(command.name) &&
        !authorPerms.has(ADMIN)
      ) {
        return game.error(message, `you haven't unlocked this command yet.`);
      }

      // Check if user is in combat
      if (player.inCombat == false && command.useInCombatOnly == true) {
        return game.error(message, `this command can only be used in combat.`);
      }

      // Check if user is allowed to attack in combat
      if (player.canAttack == false && command.useInCombatOnly == true) {
        return game.error(message, `you can't do this right now.`);
      }

      if (
        player.inCombat == true &&
        command.useInCombat !== true &&
        command.useInCombatOnly !== true &&
        command.category !== "Admin"
      ) {
        return game.error(
          message,
          `this command can't be used while in combat.`
        );
      }
    }

    // Check if the user is on cooldown for that command
    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
      if (now < expirationTime) {
        return message.channel.send(
          `:hourglass_flowing_sand: **${message.author.username}**, wait a moment before using this command again.`
        );
      }
    }

    // Update command cooldown for user
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    // Set arguments
    const commandsArgs = [message, args, player, { server, client, prisma }];

    // Try to run the command
    try {
      //const beforeCommand = Date.now();
      resolve(await command.execute(...commandsArgs));
      //const afterCommand = Date.now();
      // console.log(
      //   `command ${command.name} executed in ${
      //     afterCommand - beforeCommand
      //   }ms`
      // );
    } catch (error) {
      resolve(console.error("Something went wrong: ", error));
    }
  });
}
