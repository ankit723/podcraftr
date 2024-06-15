'use server';
import { Storage } from '@google-cloud/storage';

const storage = new Storage({ keyFilename: "pdcraftr-76a53522df14.json" });
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
