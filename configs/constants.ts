import { createAudioPlayer, NoSubscriberBehavior } from "@discordjs/voice";

const PREFIX = "a!";

const createPlayer = () => {
    const audioPlayer = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        },
    });
    return audioPlayer;
    
}

export { PREFIX, createPlayer };