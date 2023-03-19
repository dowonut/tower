import Discord from "discord.js";
import { PermissionsBitField } from "discord.js";
const ADMIN = PermissionsBitField.Flags.Administrator;

import * as config from "../../config.js";

/**
 * Execute a command on behalf of a user.
 * @param {object} args
 * @param {object} args.client - Discord client object.
 * @param {string} args.commandName - Name of command.
 * @returns Nothing
 */
export default async function runCommand(args) {
  return new Promise(async (resolve) => {
    // Get command by name
    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command) return;

    const { cooldowns } = client;

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 0) * 1000;

    // Check if user has permission to run the command
    const authorPerms = message.channel.permissionsFor(message.author);
    if (command.permissions) {
      if (!authorPerms || !authorPerms.has(command.permissions)) {
        return game.error("you're not worthy of this command.");
      }
    }

    let player = await game.getPlayer({ message: message, server: server });

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

      // check if user is allowed to attack in combat
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

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    // Set arguments
    const commandsArgs = [message, args, config, player, server, client];

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
