'use server'
import { Storage } from '@google-cloud/storage';
import textToSpeech, { protos } from '@google-cloud/text-to-speech';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import os from 'os';

const ffmpegPath = '/opt/homebrew/bin/ffmpeg'; // Set the correct path here
console.log('Using FFmpeg path:', ffmpegPath);
ffmpeg.setFfmpegPath(ffmpegPath);
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

async function concatenateAudio(files: string[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const command = ffmpeg();

        // Log files for debugging
        console.log('Files to concatenate:', files);

        files.forEach(file => {
            if (!fs.existsSync(file)) {
                console.error('File does not exist:', file);
                reject(new Error(`File not found: ${file}`));
            }
            command.input(file);
        });

        const outputPath = path.join(os.tmpdir(), `output-${Date.now()}.mp3`);

        command
            .on('error', (err) => {
                console.error('Error during audio concatenation:', err);
                reject(err);
            })
            .on('end', () => {
                console.log('Audio concatenation finished');
                fs.readFile(outputPath, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            })
            .mergeToFile(outputPath, os.tmpdir()); // Use mergeToFile instead of save

    });
}




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
        const bucket = storage.bucket(bucketName);

        if (voiceType.includes("Journey") && text.length > 1000) {
            const textChunks = text.match(/.{1,1000}/g) || [];
            console.log(textChunks)
            const audioFiles: string[] = [];

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

                const chunkFilename = path.join(os.tmpdir(), `audio-chunk-${Date.now()}-${i}.mp3`);
                fs.writeFileSync(chunkFilename, response.audioContent as Buffer);
                audioFiles.push(chunkFilename);
            }

            // Concatenate audio files
            const concatenatedAudioBuffer = await concatenateAudio(audioFiles);

            const outputFilename = `audio-${Date.now()}.mp3`;
            const outputUrl = await uploadAndMakePublic(bucket, outputFilename, concatenatedAudioBuffer);

            // Cleanup temporary files
            audioFiles.forEach(file => fs.unlinkSync(file));

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
