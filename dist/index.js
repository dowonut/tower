// auto-barrel-ignore
// Discord packages
import Discord from "discord.js";
import { REST } from "@discordjs/rest";
import { ContextMenuCommandBuilder, ApplicationCommandType, Routes, ActivityType, } from "discord.js";
// File handling
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
// Game files
import allEvents from "./game/classes/events.js";
import { game, config, prisma, client } from "./tower.js";
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
// Define main variables
const events = game.events;
// Collect commands
let commandFiles = [];
/**
 * Import files through directory
 * @param {string} directory
 * @param {Array} array
 */
function throughDirectory(directory, array) {
    fs.readdirSync(directory).forEach((file) => {
        const absolute = path.join(directory, file);
        if (fs.statSync(absolute).isDirectory())
            return throughDirectory(absolute, array);
        else
            return array.push(absolute);
    });
}
throughDirectory("./src/commands", commandFiles);
for (const file of commandFiles) {
    // Check if file is valid before continuing
    if (!file.endsWith(".js"))
        continue;
    const { default: command } = await import(`../${file}`);
    client.commands.set(command.name, command);
}
// On message sent
client.on("messageCreate", async (message) => {
    // Check if message has a guild attached
    if (!message.guild)
        return console.log("ERROR: Message did not contain a guild.");
    // Create or fetch server in database
    let server = await prisma.server.findUnique({
        where: { serverId: message.guild.id },
    });
    // Create new server in database if doesn't exist
    if (!server) {
        server = await prisma.server.create({
            data: { serverId: message.guild.id },
        });
    }
    // Check for prefix or bot
    if (!message.content.startsWith(server.prefix) || message.author.bot)
        return;
    // Create command and arguments
    /** @type {*} */
    const args = message.content.slice(server.prefix.length).trim().split(/ +/);
    if (args.length > 0) {
        const commandName = args.shift().toLowerCase();
        // Run the command
        await game.runCommand(commandName, { args, message, server });
    }
});
// On bot ready
client.on("ready", () => {
    if (client.user) {
        // Set user activity
        client.user.setActivity(config.status, {
            type: ActivityType.Watching,
        });
        console.log(`> ${client.user.username} has logged in.`);
    }
});
// Login bot
client.login(process.env.BOT_TOKEN);
const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN || "");
// Create slash commands
const slashCommands = [
    new ContextMenuCommandBuilder()
        .setName("Explore")
        .setType(ApplicationCommandType.Message),
].map((cmd) => cmd.toJSON());
// Register slash commands
(async () => {
    try {
        await rest.put(Routes.applicationCommands("855569016810373140"), {
            body: slashCommands,
        });
        console.log("> Loaded application commands.");
    }
    catch (error) {
        console.error(error);
    }
})();
// On interaction
client.on("interactionCreate", async (interaction) => {
    // Check if interaction is a context menu
    if (!interaction.isMessageContextMenuCommand())
        return;
    if (!interaction.guildId)
        return;
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
    /** @type {*} */
    const message = interaction;
    message.author = interaction.user;
    // Run the command
    await game.runCommand(commandName, { message, server });
});
// Initialise all events
for (const event of allEvents) {
    events.on(event.name, async (obj) => {
        try {
            // Run event function
            await event.function(obj);
        }
        catch (error) {
            console.log(error);
        }
    });
}
