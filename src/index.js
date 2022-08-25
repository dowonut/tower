// Discord packages
import Discord from "discord.js";
import { REST } from "@discordjs/rest";
import {
  Client,
  IntentsBitField,
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  Routes,
} from "discord.js";
// Prisma packages
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
// File handling
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
// Config
import * as config from "./config.js";
// Game files
import allEvents from "./game/classes/events.js";

const prisma = new PrismaClient();

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
// Define global variable with all functions
global.game = game;
global.prisma = prisma;
global.client = client;
// Get events
const events = game.events;

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

  // Run the command
  await game.runCommand(commandName, message, args, server, client);
});

// On bot ready
client.on("ready", () => {
  // Set user activity
  client.user.setActivity(config.status, {
    type: "WATCHING",
  });

  console.log(`> ${client.user.username} has logged in.`);
});

// Login bot
client.login(process.env.BOT_TOKEN);

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

// Create slash commands
const commands = [
  new ContextMenuCommandBuilder()
    .setName("Explore")
    .setType(ApplicationCommandType.Message),
].map((cmd) => cmd.toJSON());

// Register slash commands
(async () => {
  try {
    await rest.put(Routes.applicationCommands("855569016810373140"), {
      body: commands,
    });
    console.log("> Loaded application commands.");
  } catch (error) {
    console.error(error);
  }
})();

// On interaction
client.on("interactionCreate", async (interaction) => {
  // Check if interaction is a context menu
  if (!interaction.isMessageContextMenuCommand()) return;

  // Create or fetch server in database
  let server = await prisma.server.findUnique({
    where: { serverId: interaction.guildId },
  });

  if (!server) {
    server = await prisma.server.create({
      data: { serverId: interaction.guildId },
    });
  }

  // Set command name
  const commandName = interaction.commandName.toLowerCase();

  await interaction.reply({
    content: `Executed command: \`${commandName}\``,
    ephemeral: true,
  });

  const message = interaction;
  message.author = interaction.user;

  // Run the command
  await game.runCommand(commandName, message, [], server, client);
});

// Initialise all events
for (const event of allEvents) {
  events.on(event.name, async (obj) => {
    try {
      // Run event function
      await event.function(obj);
    } catch (error) {
      console.log(error);
    }
  });
}
