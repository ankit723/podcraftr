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

async function uploadAndMakePublic(bucket: any, filename: string, audioContent: Buffer) {
    const file = bucket.file(filename);
    await file.save(audioContent, {
        metadata: {
            contentType: 'audio/mpeg'
        }
    });

    await file.makePublic();
    return `https://storage.googleapis.com/${bucketName}/${filename}`;
}

function concatenateBuffers(buffers: Buffer[]): Buffer {
    let totalLength = 0;
    buffers.forEach(buffer => {
        totalLength += buffer.length;
    });

    const resultBuffer = Buffer.alloc(totalLength);
    let offset = 0;

    buffers.forEach(buffer => {
        buffer.copy(resultBuffer, offset);
        offset += buffer.length;
    });

    return resultBuffer;
}

interface SynthesizeSpeechParams {
    text: string;
    voiceType: string;
    language: string;
    save: boolean;
}

interface SynthesizeSpeechResult {
    publicUrl: string;
    outputFilename: string;
}

export async function SynthesizeSpeech({ text, voiceType, language, save }: SynthesizeSpeechParams): Promise<SynthesizeSpeechResult> {
    const synthesisInput: protos.google.cloud.texttospeech.v1.ISynthesisInput = { text };

    const voice: protos.google.cloud.texttospeech.v1.IVoiceSelectionParams = {
        languageCode: language,
        name: voiceType
    };

    const audioConfig: protos.google.cloud.texttospeech.v1.IAudioConfig = {
        audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3
    };

    try {
        const bucket = storage.bucket(bucketName);

        if (voiceType.includes("Journey") && text.length > 1000) {
            const textChunks = text.match(/.{1,1000}/g) || [];
            console.log(textChunks);
            const audioBuffers: Buffer[] = [];

            for (let i = 0; i < textChunks.length; i++) {
                const chunkInput: protos.google.cloud.texttospeech.v1.ISynthesisInput = { text: textChunks[i] };
                const [response] = await client.synthesizeSpeech({
                    input: chunkInput,
                    voice,
                    audioConfig
                });

                if (!response.audioContent) {
                    throw new Error('Failed to synthesize speech for chunk');
                }

                audioBuffers.push(response.audioContent as Buffer);
            }

            // Concatenate audio buffers
            const concatenatedAudioBuffer = concatenateBuffers(audioBuffers);

            const outputFilename = `audio-${Date.now()}.mp3`;
            const outputUrl = await uploadAndMakePublic(bucket, outputFilename, concatenatedAudioBuffer);

            return { publicUrl: outputUrl, outputFilename };
        } else {
            const [response] = await client.synthesizeSpeech({
                input: synthesisInput,
                voice,
                audioConfig
            });

            if (!response.audioContent) {
                throw new Error('Failed to synthesize speech.');
            }

            const outputFilename = `audio-${Date.now()}.mp3`;
            const publicUrl = await uploadAndMakePublic(bucket, outputFilename, response.audioContent as Buffer);

            return { publicUrl, outputFilename };
        }
    } catch (error) {
        console.error('Error synthesizing or saving speech:', error);
        throw new Error('Failed to synthesize or save speech');
    }
}
