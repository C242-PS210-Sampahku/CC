import { Storage } from '@google-cloud/storage';

const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID,
    credentials: {
        private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.GCP_CLIENT_EMAIL,
    },
});

const bucket = storage.bucket('sampahku-storage');

/**
 * Fungsi untuk mengunggah file ke Google Cloud Storage.
 *
 * @param {Buffer} fileBuffer - Buffer file yang akan diunggah.
 * @param {string} mimetype - MIME type file.
 * @param {string} originalName - Nama file asli.
 * @param {string} folder - (Opsional) Nama folder tujuan di bucket.
 * @returns {string} URL file yang diunggah.
 */
export const uploadToGCS = async (fileBuffer, mimetype, originalName, folder = '') => {
    try {
        const timestamp = new Date().toISOString();
        const fileExtension = originalName.split('.').pop();
        const destination = folder
            ? `${folder}/profile-${timestamp}.${fileExtension}`
            : `profile-${timestamp}.${fileExtension}`;

        const blob = bucket.file(destination);
        const blobStream = blob.createWriteStream({
            resumable: false,
            contentType: mimetype,
        });

        await new Promise((resolve, reject) => {
            blobStream.on('finish', () => {
                console.log('File uploaded successfully to GCS');
                resolve();
            });
            blobStream.on('error', (err) => {
                reject(err);
            });
            blobStream.end(fileBuffer);
        });
        const fileUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
        return fileUrl;
    } catch (error) {
        console.error('Error uploading file to Google Cloud Storage:', error.stack);
        throw new Error('Failed to upload file to Google Cloud Storage');
    }
};
