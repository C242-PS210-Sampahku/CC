import multer from 'multer';

// Konfigurasi penyimpanan file di memori
const storage = multer.memoryStorage();
const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed.'));
        }
    },

});

export default upload;
