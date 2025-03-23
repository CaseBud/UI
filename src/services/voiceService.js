import { Voice } from 'elevenlabs-api';

export class VoiceService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.voiceInstance = null;
    }

    initialize() {
        if (!this.voiceInstance) {
            this.voiceInstance = new Voice(this.apiKey);
        }
    }

    async textToSpeech(text) {
        if (!this.voiceInstance) {
            throw new Error('Voice service not initialized');
        }

        try {
            const response = await this.voiceInstance.textToSpeech({
                text,
                voiceId: import.meta.env.VITE_ELEVEN_LABS_VOICE_ID,
                model: 'eleven_monolingual_v1'
            });

            return new Blob([response], { type: 'audio/mpeg' });
        } catch (error) {
            console.error('Text to speech error:', error);
            throw error;
        }
    }
}
