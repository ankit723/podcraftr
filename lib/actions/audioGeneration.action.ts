// components/SynthesizeSpeech.ts

'use server';

import { Storage } from '@google-cloud/storage';
import textToSpeech, { protos } from '@google-cloud/text-to-speech';

// Parse credentials from environment variables
const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CLOUD_CREDENTIALS_JSON || "{}");
const speechCredentials = JSON.parse(process.env.GOOGLE_APPLICATION_TTS_CREDENTIALS_JSON || "{}");

// Initialize clients
const storage = new Storage({ credentials });
const client = new textToSpeech.TextToSpeechClient({ credentials: speechCredentials });

// Define your Google Cloud Storage bucket name
const bucketName = 'podcraftr-profile-image-bucket';

export async function SynthesizeSpeech({ text, voiceType, language, save }: {
    text: string,
    voiceType: string,
    language: string,
    save: boolean
}): Promise<{ publicUrl: string; outputFilename: string }> {

    const synthesisInput: protos.google.cloud.texttospeech.v1.ISynthesisInput = { text };

    const voice: protos.google.cloud.texttospeech.v1.IVoiceSelectionParams = {
        languageCode: language,
        name: voiceType
    };

    const audioConfig: protos.google.cloud.texttospeech.v1.IAudioConfig = {
        audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3
    };

    try {
        const [response] = await client.synthesizeSpeech({
            input: synthesisInput,
            voice,
            audioConfig
        });

        if (!response.audioContent) {
            throw new Error('Failed to synthesize speech.');
        }

        const outputFilename = `audio-${Date.now()}.mp3`;
        const bucket = storage.bucket(bucketName);
        const file = bucket.file(outputFilename);
        await file.save(response.audioContent, {
            metadata: {
                contentType: 'audio/mpeg'
            }
        });

        // Make the file publicly accessible
        await file.makePublic();

        // Get the public URL
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${outputFilename}`;

        return { publicUrl, outputFilename };

    } catch (error) {
        console.error('Error synthesizing or saving speech:', error);
        throw new Error('Failed to synthesize or save speech');
    }
}
