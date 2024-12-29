import type { AudioPlayer } from "@discordjs/voice";
import { Collection } from "discord.js";

// collection of audio players
const audioPlayers = new Collection<string, AudioPlayer>();

export { audioPlayers };