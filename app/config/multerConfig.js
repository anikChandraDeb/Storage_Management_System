import multer from 'multer';
import path from 'node:path';
import fs from 'fs';

// Helper to get __dirname in ES module syntax
const __dirname = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1');
console.log(__dirname)
// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.headers.user_id;
    if (!userId) {
      return cb(new Error('User ID is required'), null);
    }

    const userFolderPath = path.join(__dirname, '../../storage', userId.toString());
    if (typeof userFolderPath !== 'string') {
      return cb(new Error('Invalid path for user folder'), null);
    }

    if (!fs.existsSync(userFolderPath)) {
      fs.mkdirSync(userFolderPath, { recursive: true });
    }

    cb(null, userFolderPath);
  },
  filename: (req, file, cb) => {
    // Modify the file name by appending the timestamp to avoid conflicts
    const modifiedFileName = `${Date.now()}_${file.originalname}`;
    cb(null, modifiedFileName);  // Use the modified filename
  },
});

export const upload = multer({ storage ,limits: {
    fileSize: 5 * 1024 * 1024, // Limit files to 5MB
  },});

