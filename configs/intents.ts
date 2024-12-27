import { GatewayIntentBits} from "discord.js";

export const INTENTS = [GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers, 
    GatewayIntentBits.GuildVoiceStates, 
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
];