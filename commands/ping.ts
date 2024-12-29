import { ChannelType, SlashCommandBuilder, TextChannel, type Client, type Message } from "discord.js";
import type { Command } from "../types/Command";

const ping: Command = {query:
    {
        keyword: "ping",
        callback: (client:Client, message: Message, parameter) => {
            if (message.author.bot) return;

            if (message.channel.type === ChannelType.GuildText) {
                (message.channel as TextChannel).send("Pong!");
            }
        }
    },
    slashCommand: {
        data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
        execute: async (client, interaction) => {
            await interaction.reply("Pong!");
        }
    }
}

export default ping;