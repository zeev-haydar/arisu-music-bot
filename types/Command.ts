import { CommandInteraction, SlashCommandBuilder, type InteractionContextType } from "discord.js"

export type Command = {
    query: {
        keyword: string,
        callback: (client: any, message: any) => void
    }
    slashCommand: {
        builder: SlashCommandBuilder,
        execute: (interaction: CommandInteraction) => Promise<void>;

    }
}
