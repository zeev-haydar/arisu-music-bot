import { Client, CommandInteraction, Message, SlashCommandBuilder, type SlashCommandOptionsOnlyBuilder } from "discord.js"

export type Command = {
    query: {
        keyword: string,
        callback: (client: Client, message: Message, parameters: String[] | null, ...opt_args: any[]) => void
    }
    slashCommand: {
        data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder,
        execute: (client: Client, interaction: CommandInteraction) => Promise<void>;

    }
}
