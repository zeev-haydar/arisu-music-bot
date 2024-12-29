import { AudioPlayer, getVoiceConnection, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";
import { ChatInputCommandInteraction, Client, Collection, CommandInteraction, Message, SlashCommandBuilder, TextChannel, type RepliableInteraction, type VoiceBasedChannel } from "discord.js";
import { audioPlayers } from "../configs/maps";
import type { Command } from "../types/Command";

const pause: Command = {
    query: {
        keyword: "pause",
        callback: (client:Client, message:Message) => {
            if (message.author.bot) return;

            // Check if the user is in a voice channel
            if (!message.member?.voice.channel) {
                message.reply("You must be in a voice channel to pause music!");
                return;
            }

            const voiceChannel = message.member.voice.channel;

            handlePause(client, voiceChannel, message);
        }
    },
    slashCommand: {
        data: new SlashCommandBuilder().setName("pause").setDescription("Pause the music"),
        execute: async (client:Client, interaction:CommandInteraction) => {
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

            handlePause(client, voiceChannel, interaction);
        }
    }
}

function handlePause(client: Client, voiceChannel: VoiceBasedChannel, context: Message | CommandInteraction) {
     // Check if there's an existing connection for the guild
     let connection: VoiceConnection | undefined = getVoiceConnection(voiceChannel.guild.id);

     if (!connection) {
        context.reply("I'm not playing any music!");
         return;
     }

     if (connection.joinConfig.channelId !== voiceChannel.id) {
        context.reply("I'm not in the same voice channel as you!");
         return;
     }

     // get the audio player
     let audioPlayer = audioPlayers.get(voiceChannel.guild.id);

     const paused = audioPlayer?.pause();
     
     if (paused) {
        context.reply("Paused the music!");
     } else {
        context.reply("The music is already paused!");
     }
}

export default pause;