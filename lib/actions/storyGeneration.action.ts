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

async function uploadAndMakePublic(bucket: Storage.Bucket, filename: string, audioContent: Buffer): Promise<string> {
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

interface Dialogue {
    voiceType: string;
    speech: string;
}

interface SynthesizeStorySpeechParams {
    dialouges: Dialogue[];
}

interface SynthesizeStorySpeechResult {
    publicUrl: string;
    outputFilename: string;
}

export async function SynthesizeStorySpeech({ dialouges }: SynthesizeStorySpeechParams): Promise<SynthesizeStorySpeechResult> {
    const audioConfig: protos.google.cloud.texttospeech.v1.IAudioConfig = {
        audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3
    };

    try {
        const bucket = storage.bucket(bucketName);
        const audioBuffers: Buffer[] = [];

        for (let i = 0; i < dialouges.length; i++) {
            const voice: protos.google.cloud.texttospeech.v1.IVoiceSelectionParams = {
                languageCode: dialouges[i].voiceType.includes("hi-IN") ? "hi-IN" : "en-US",
                name: dialouges[i].voiceType
            };
            const chunkInput: protos.google.cloud.texttospeech.v1.ISynthesisInput = { text: dialouges[i].speech };
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
    } catch (error) {
        console.error('Error synthesizing or saving speech:', error);
        throw new Error('Failed to synthesize or save speech');
    }
}
