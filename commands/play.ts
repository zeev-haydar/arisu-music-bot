import { Client, CommandInteraction, Message, SlashCommandBuilder, TextChannel, type VoiceBasedChannel } from "discord.js";
import type { Command } from "../types/Command";
import { AudioPlayerStatus, createAudioResource, getVoiceConnection, joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import { createPlayer, PREFIX } from "../configs/constants";
import * as fs from "fs";
import * as path from "path";
import { audioPlayers } from "../configs/maps";

/**
 * Play Song command 
 * 
 * Usage:
 * `prefix + play [song]`
 */

const play: Command = {
    query:
    {
        keyword: "play",
        callback: (client, message, parameter) => {
            if (message.author.bot) return;

            // Check if the user is in a voice channel
            if (!message.member?.voice.channel) {
                message.reply("You must be in a voice channel to play music!");
                return;
            }

            const voiceChannel = message.member.voice.channel;

            if (!parameter || parameter.length === 0) {
                message.reply(`Please specify the song name! Usage: ${PREFIX}play [song]`);
                return;
            }
            const song = parameter[0] as string

           handlePlay(client, voiceChannel, message, song);
        },
    },
    slashCommand: {
        data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays music!")
        .addStringOption(
            option => option.setName("song")
                .setDescription("The song to play")
                .setRequired(true)
        ),
        async execute (client, interaction) {
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
                await interaction.reply("You must be in a voice channel to pause music!");
                return;
            }
        }
    }
}

function handlePlay(client: Client, voiceChannel: VoiceBasedChannel, context: Message | CommandInteraction, song:string) {
    let connection: VoiceConnection | undefined = getVoiceConnection(voiceChannel.guild.id);
            
            if (connection && connection.joinConfig.channelId !== voiceChannel.id) {
                // Destroy existing connection if the bot is in a different channel
                connection.destroy();
                console.log(`Left the old channel in guild: ${voiceChannel.guild.id}`);
                connection = undefined;
            }

            if (!connection) {
                connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: voiceChannel.guild.id,
                    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                });
                console.log(`Joined voice channel in guild: ${voiceChannel.guild.id}`);
            }

            const musicPath = process.env.MUSIC_PATH;
            if (!musicPath) {
                context.reply("Music path is not set!");
                return;
            }

            if (!fs.existsSync(musicPath)) {
                context.reply("The music path does not exist. Please set a valid music path.");
                return;
            }

            // Check if the requested song exists
            const songPath = path.join(musicPath, song);
            if (!fs.existsSync(songPath)) {
                context.reply(`The requested song "${song}" does not exist in the music path.`);
                return;
            }

            const audioPlayer = createPlayer();
            const audioResource = createAudioResource(musicPath +"/"+ song);

            if (!audioResource) {
                context.reply("Song not found!");
                return;
            }

            // Subscribe the audio player to the connection and play the song
            try {
                const textChannel = context.channel as TextChannel;
                if (!textChannel) {
                    context.reply("Text channel not found!");
                    return;
                };
                const subscription = connection?.subscribe(audioPlayer);
                if (subscription) {
                    audioPlayer.play(audioResource);
                    audioPlayers.set(voiceChannel.guild.id, audioPlayer);
                    console.log(`Playing song: ${song}`);
                    textChannel.send(`Playing song: ${song}`);
                    audioPlayer.on(AudioPlayerStatus.Idle, () => {
                        console.log(`Finished playing song: ${song}`);
                        subscription.unsubscribe();
                        console.log(`Unsubscribed audio for guild: ${voiceChannel.guild.id}`);
                    });
            
                    audioPlayer.on('error', (error) => {
                        console.error('Audio player error:', error);
                        subscription.unsubscribe();
                        connection?.destroy();
                    });
                }
            } catch (error) {
                console.error("Error playing audio:", error);
                context.reply("An error occurred while playing the song.");
            }

}

export default play;