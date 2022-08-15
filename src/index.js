import Discord from "discord.js";
import {
  Client,
  GatewayIntentBits,
  IntentsBitField,
  Partials,
} from "discord.js";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import * as config from "./config.js";

const prisma = new PrismaClient();

// const client = new Client({
//   intents: [
//     GatewayIntentBits.Guilds,
//     GatewayIntentBits.GuildMessages,
//     GatewayIntentBits.GuildMessageReactions,
//     GatewayIntentBits.GuildMembers,
//     GatewayIntentBits.GuildEmojisAndStickers,
//     GatewayIntentBits.GuildMessageTyping,
//   ],
// });

const client = new Client({ intents: new IntentsBitField(36363) });

client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

// Main game object
let game = new Object();

// Collect commands
let commandFiles = [];
function throughDirectory(directory, array) {
  fs.readdirSync(directory).forEach((file) => {
    const absolute = path.join(directory, file);
    if (fs.statSync(absolute).isDirectory())
      return throughDirectory(absolute, array);
    else return array.push(absolute);
  });
}
throughDirectory("./src/commands", commandFiles);

for (const file of commandFiles) {
  const { default: command } = await import(`../${file}`);
  client.commands.set(command.name, command);
}

// Collect functions
let functionFiles = [];
throughDirectory("./src/functions", functionFiles);

for (const file of functionFiles) {
  const { default: gameFunction } = await import(`../${file}`);
  game = { ...game, ...gameFunction };
}

// On message sent
client.on("messageCreate", async (message) => {
  // Create or fetch server in database
  let server = await prisma.server.findUnique({
    where: { serverId: message.guild.id },
  });

  if (!server) {
    server = await prisma.server.create({
      data: { serverId: message.guild.id },
    });
  }

  // Check for prefix or bot
  if (!message.content.startsWith(server.prefix) || message.author.bot) return;

  // Create command and arguments
  const args = message.content.slice(server.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  await game.runCommand(
    commandName,
    client,
    message,
    args,
    prisma,
    game,
    server
  );

  // // Check for aliases
  // const command =
  //   client.commands.get(commandName) ||
  //   client.commands.find(
  //     (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
  //   );

  // if (!command) return;

  // const { cooldowns } = client;

  // if (!cooldowns.has(command.name)) {
  //   cooldowns.set(command.name, new Discord.Collection());
  // }

  // const now = Date.now();
  // const timestamps = cooldowns.get(command.name);
  // const cooldownAmount = (command.cooldown || 0) * 1000;

  // // Check if user has permission to run the command
  // const authorPerms = message.channel.permissionsFor(message.author);
  // if (command.permissions) {
  //   if (!authorPerms || !authorPerms.has(command.permissions)) {
  //     return game.error("you're not worthy of this command.");
  //   }
  // }

  // let playerData = await game.getPlayer(message, prisma);

  // // Check if user has player character
  // if (command.needChar !== false && !playerData) {
  //   return game.reply(message, `get started with \`${server.prefix}begin\``);
  // }

  // // Make object null if no player data
  // if (playerData) {
  //   var player = { ...playerData, ...game.player, prisma };

  //   //console.log(player);

  //   // Check if user is admin
  //   if (command.category == "Admin" && !authorPerms.has(["ADMINISTRATOR"])) {
  //     return game.error(message, `this command requires admin permissions.`);
  //   }

  //   // Check if command is unlocked
  //   if (
  //     !player.unlockedCommands.includes(command.name) &&
  //     !authorPerms.has(["ADMINISTRATOR"])
  //   ) {
  //     return game.error(message, `you haven't unlocked this command yet.`);
  //   }

  //   // Check if user is in combat
  //   if (player.inCombat == false && command.useInCombatOnly == true) {
  //     return game.error(message, `this command can only be used in combat.`);
  //   }

  //   // check if user is allowed to attack in combat
  //   if (player.canAttack == false && command.useInCombatOnly == true) {
  //     return game.error(message, `you can't do this right now.`);
  //   }

  //   if (
  //     player.inCombat == true &&
  //     command.useInCombat !== true &&
  //     command.useInCombatOnly !== true &&
  //     command.category !== "Admin"
  //   ) {
  //     return game.error(message, `this command can't be used while in combat.`);
  //   }
  // } else {
  //   var player = null;
  // }

  // // Check if the user is on cooldown for that command
  // if (timestamps.has(message.author.id)) {
  //   const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
  //   if (now < expirationTime) {
  //     return message.channel.send(
  //       `:hourglass_flowing_sand: **${message.author.username}**, wait a moment before using this command again.`
  //     );
  //   }
  // }

  // timestamps.set(message.author.id, now);
  // setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  // // Try to run the command
  // try {
  //   const beforeCommand = Date.now();
  //   await command.execute(message, args, prisma, config, player, game, server);
  //   const afterCommand = Date.now();
  //   console.log(
  //     `command ${command.name} executed in ${afterCommand - beforeCommand}ms`
  //   );
  // } catch (error) {
  //   console.error(error);
  // }
});

client.on("ready", () => {
  // Set user activity
  client.user.setActivity(config.status, {
    type: "WATCHING",
  });

  console.log(`> ${client.user.username} has logged in.`);
});

client.login(process.env.BOT_TOKEN);
