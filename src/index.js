import Discord from "discord.js";
import { Client, Intents } from "discord.js";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import * as config from "./config.js";

const prisma = new PrismaClient();

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});

client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

// Main functions object
let functions = new Object();

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
  functions = { ...functions, ...gameFunction };
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

  if (!message.content.startsWith(server.prefix) || message.author.bot) return;

  // Create command and arguments
  const args = message.content.slice(server.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Check for aliases
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
      return message.channel.send("You are not worthy of this command.");
    }
  }

  let playerData = await prisma.player.findUnique({
    where: { discordId: message.author.id },
  });

  // Check if user has player character
  if (command.needChar !== false && !playerData) {
    return message.reply(`Get started with \`-begin\``);
  }

  // Make object null if no player data
  if (playerData) {
    var player = { ...playerData, ...functions.player, prisma };
  } else {
    var player = null;
  }

  // Check if the user is on cooldown for that command
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    if (now < expirationTime) {
      return message.channel.send("Wait before using this command again.");
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  // Try to run the command
  try {
    await command.execute(
      message,
      args,
      prisma,
      config,
      player,
      functions,
      server
    );
  } catch (error) {
    console.error(error);
  }
});

client.on("ready", () => {
  // Set user activity
  client.user.setActivity(config.status, {
    type: "WATCHING",
  });

  console.log(`> ${client.user.username} has logged in.`);
});

client.login(process.env.BOT_TOKEN);
