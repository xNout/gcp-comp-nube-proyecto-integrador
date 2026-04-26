import multer from 'multer';
import { APP_CONFIG } from '../config/app.config';
import { MESSAGES } from '../config/messages.config';

const memoryStorage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage: memoryStorage,
  limits: {
    fileSize: APP_CONFIG.maxFileSizeBytes,
  },
  fileFilter: (_req, file, cb) => {
    const allowed = APP_CONFIG.allowedMimeTypes as readonly string[];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error(
        MESSAGES.errors.invalidFileType.replace(
          '{types}',
          APP_CONFIG.allowedMimeTypes.join(', ')
        )
      );
      cb(error as unknown as null, false);
    }
  },
});
