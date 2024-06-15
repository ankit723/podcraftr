'use server';
import { Storage } from '@google-cloud/storage';

const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CLOUD_CREDENTIALS_JSON||"");

const storage = new Storage({ credentials});
const bucketName = 'podcraftr-profile-image-bucket';

export const UploadImage = async (form: FormData) => {
    const bucket = storage.bucket(bucketName);

    const file = form.get('profile_photo') as File;

    if (!file) {
        throw new Error('No file provided');
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const blob = bucket.file(file.name);
    const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: file.type,
    });

    const uploadPromise = new Promise<{ fileUrl: string }>((resolve, reject) => {
        blobStream.on('error', (err) => reject(err));
        blobStream.on('finish', async () => {
            // Make the file public
            await blob.makePublic();
            const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
            resolve({ fileUrl: publicUrl });
        });

        blobStream.end(buffer);
    });

    return uploadPromise;
};
