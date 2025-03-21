import { useState } from 'react';
import { AssemblyAi } from 'assemblyai-api';
require('dotenv').config();

const AudioTranscriber = () => {
    const [transcription, setTranscript] = useState('');
    const [status, setStatus] = useState('');
    const [erro, setError] = useState(null);

    const client = new AssemblyAi({
        apiKey: process.env.ASSEMBLYAI_API_KEY,
    });

}