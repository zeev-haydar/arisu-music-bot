import { AudioPlayer, getVoiceConnection, VoiceConnection } from "@discordjs/voice";
import { 
    Client, 
    CommandInteraction, 
    Message, 
    SlashCommandBuilder, 
    type VoiceBasedChannel 
} from "discord.js";
import { audioPlayers } from "../configs/maps";
import type { Command } from "../types/Command";

const resume: Command = {
    query: {
        keyword: "resume",
        callback: (client: Client, message: Message) => {
            if (message.author.bot) return;

            // Check if the user is in a voice channel
            if (!message.member?.voice.channel) {
                message.reply("You must be in a voice channel to resume music!");
                return;
            }

            const voiceChannel = message.member.voice.channel;

            handleResume(client, voiceChannel, message);
        },
    },
    slashCommand: {
        data: new SlashCommandBuilder()
            .setName("resume")
            .setDescription("Resume the paused music"),
        execute: async (client: Client, interaction: CommandInteraction) => {
            if (!interaction.guildId) return;
            const guildId = interaction.guildId;
            const guild = client.guilds.cache.get(guildId);

            if (!guild) {
                await interaction.reply("Command error: Guild not found!");
                return;
            }

            const member = guild.members.cache.get(interaction.user.id);
            if (!member) {
                await interaction.reply("Command error: Member not found!");
                return;
            }

            const voiceChannel = member.voice.channel;

            if (!voiceChannel) {
                await interaction.reply("You must be in a voice channel to resume music!");
                return;
            }

            handleResume(client, voiceChannel, interaction);
        },
    },
};

function handleResume(client: Client, voiceChannel: VoiceBasedChannel, context: Message | CommandInteraction) {
    // Check if there's an existing connection for the guild
    const connection: VoiceConnection | undefined = getVoiceConnection(voiceChannel.guild.id);

    if (!connection) {
        context.reply("I'm not playing any music!");
        return;
    }

    if (connection.joinConfig.channelId !== voiceChannel.id) {
        context.reply("I'm not in the same voice channel as you!");
        return;
    }

    // Get the audio player
    const audioPlayer = audioPlayers.get(voiceChannel.guild.id);

    const resumed = audioPlayer?.unpause();

    if (resumed) {
        context.reply("Resumed the music!");
    } else {
        context.reply("The music is not paused!");
    }
}

export default resume;
