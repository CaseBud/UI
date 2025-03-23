// voiceService.js
import { ElevenLabsClient } from 'elevenlabs';

export class VoiceService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.voiceInstance = null;
    }

    initialize() {
        if (!this.voiceInstance) {
            this.voiceInstance = new ElevenLabsClient({
                apiKey: this.apiKey
            });
        }
    }

    async textToSpeech(text) {
        if (!this.voiceInstance) {
            throw new Error('Voice service not initialized');
        }

        try {
            const audio = await this.voiceInstance.generate({
                voice: import.meta.env.VITE_ELEVEN_LABS_VOICE_ID,
                text: text,
                model_id: 'eleven_multilingual_v2',
                output_format: 'mp3_44100_128'
            });

            return new Blob([audio], { type: 'audio/mp3' });
        } catch (error) {
            console.error('Text to speech error:', error);
            throw error;
        }
    }
}