import { ChannelType, SlashCommandBuilder, TextChannel, type Client, type Message } from "discord.js";
import type { Command } from "../types/Command";

const ping: Command = {query:
    {
        keyword: "ping",
        callback: async (client:Client, message: Message) => {
            if (message.author.bot) return;

            if (message.channel.type === ChannelType.GuildText) {
                await (message.channel as TextChannel).send("Pong!");
            }
        }
    },
    slashCommand: {
        builder: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
        execute: async (interaction) => {
            await interaction.reply("Pong!");
        }
    }
}

export default ping;