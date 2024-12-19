import multer from 'multer';

// Set up memory storage for multer
const storage = multer.memoryStorage();

// Set up file filter to only accept specific file types (images and videos)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mkv/;
  const mimeType = file.mimetype.split('/')[1];
  if (allowedTypes.test(mimeType)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB file size limit
});

export default upload;
