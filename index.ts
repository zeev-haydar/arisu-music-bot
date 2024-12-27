import { Client, Collection, Guild, REST, Routes, type RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";
import { INTENTS } from "./configs/intents";
import fs from "fs";
import path from "path";
import type { Command } from "./types/Command";
import { specialSplit } from "./utils";
import { prefix } from "./configs/constants";



// Convert string intents to Intents constants
const TOKEN = process.env.DISCORD_APP_TOKEN as string;
const CLIENT_ID = process.env.CLIENT_ID as string;

const client = new Client({ intents: INTENTS });
// Initialize REST for command registration
const rest = new REST({ version: "10" }).setToken(TOKEN);

// Path to command dir
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js") || file.endsWith(".ts"));

const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
const commandMap = new Map<string, Command>();

var connectedGuilds: Collection<string, Guild>;

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath) as { default: Command };
    // console.log(`Loaded command file: ${filePath}`, command);

    if (command.default) {
        commands.push(command.default.slashCommand.builder.toJSON());
        commandMap.set(command.default.query.keyword, command.default);
    } else {
        console.error(`Invalid command structure in file: ${filePath}`);
    }
}
// console.log("commands: ", commandMap);

client.on("ready", async () => {
    console.log(`Logged in as ${client.user?.tag}`);
    connectedGuilds = client.guilds.cache;

    // Register commands with Discord
    try {
        console.log("Started refreshing application (/) commands.");

        if (connectedGuilds) {
            for (const guild of connectedGuilds) {
                const guildId = guild[0];
                await rest.put(Routes.applicationGuildCommands(CLIENT_ID, guildId), {
                    body: commands,
                });
            }

            console.log("Successfully reloaded application (/) commands.");
        }
    } catch (error) {
        console.error("Error registering commands:", error);
    }
});

// handle the interactionCreate and messageCreate events
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = commandMap.get(interaction.commandName);

    if (command) {
        await command.slashCommand.execute(interaction);
    }
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (!message.content.startsWith(prefix)) return;
    console.log("message received: ", message.content);
    const args = specialSplit(message.content);
    console.log("args: ", args);
    let command = args.shift()?.toLowerCase();

    if (command) {
        // check if the command follow the format of prefix + query
       
        
        // omit the prefix
        command = command.slice(prefix.length);
        console.log("command: ", command);
        
        const cmd = commandMap.get(command);
        console.log("cmd: ", cmd);

        if (cmd) {
            cmd.query.callback(client, message);
        }
    }
});

//login
client.login(TOKEN);