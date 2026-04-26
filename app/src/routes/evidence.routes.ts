import { Router, Request, Response } from 'express';
import { APP_CONFIG } from '../config/app.config';
import { MESSAGES } from '../config/messages.config';
import { uploadMiddleware } from '../middlewares/upload.middleware';
import { uploadFile, listFiles, getFileStream } from '../services/storage.service';

const router = Router();

router.get(APP_CONFIG.routes.upload, (_req: Request, res: Response) => {
  res.render('upload', {
    title: MESSAGES.upload.pageTitle,
    error: null,
    success: null,
  });
});

router.post(
  APP_CONFIG.routes.upload,
  (req: Request, res: Response, next) => {
    uploadMiddleware.single('file')(req, res, (err: unknown) => {
      if (err instanceof Error) {
        if (err.message.includes('file size')) {
          return res.render('upload', {
            title: MESSAGES.upload.pageTitle,
            error: MESSAGES.errors.fileTooLarge.replace(
              '{maxSize}',
              String(APP_CONFIG.maxFileSizeBytes / 1024 / 1024)
            ),
            success: null,
          });
        }
        return res.render('upload', {
          title: MESSAGES.upload.pageTitle,
          error: err.message,
          success: null,
        });
      }
      next();
    });
  },
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.render('upload', {
          title: MESSAGES.upload.pageTitle,
          error: MESSAGES.upload.errorNoFile,
          success: null,
        });
      }

      await uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype);

      return res.render('upload', {
        title: MESSAGES.upload.pageTitle,
        error: null,
        success: MESSAGES.upload.successMessage,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Upload error:', error);
      return res.render('upload', {
        title: MESSAGES.upload.pageTitle,
        error: MESSAGES.errors.uploadFailed,
        success: null,
      });
    }
  }
);

router.get(APP_CONFIG.routes.evidences, async (_req: Request, res: Response) => {
  try {
    const files = await listFiles();
    return res.render('evidences', {
      title: MESSAGES.evidences.pageTitle,
      files,
      error: null,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('List error:', error);
    return res.render('evidences', {
      title: MESSAGES.evidences.pageTitle,
      files: [],
      error: MESSAGES.evidences.loadError,
    });
  }
});

router.get(APP_CONFIG.routes.download, async (req: Request, res: Response) => {
  try {
    const encodedName = req.params.encodedName;
    if (!encodedName) {
      return res.status(404).render('error', {
        title: MESSAGES.errors.notFoundTitle,
        statusCode: 404,
        message: MESSAGES.errors.fileNotFound,
        stack: '',
      });
    }

    const fileName = decodeURIComponent(String(encodedName));
    const fileData = await getFileStream(fileName);

    if (!fileData) {
      return res.status(404).render('error', {
        title: MESSAGES.errors.notFoundTitle,
        statusCode: 404,
        message: MESSAGES.errors.fileNotFound,
        stack: '',
      });
    }

    res.setHeader('Content-Type', fileData.contentType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(fileData.originalName)}"`
    );
    fileData.stream.pipe(res);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Download error:', error);
    return res.status(500).render('error', {
      title: MESSAGES.errors.genericTitle,
      statusCode: 500,
      message: MESSAGES.errors.downloadFailed,
      stack: '',
    });
  }
});

router.get(APP_CONFIG.routes.health, (_req: Request, res: Response) => {
  res.status(200).json({
    status: MESSAGES.health.statusOk,
    service: APP_CONFIG.serviceName,
    timestamp: new Date().toISOString(),
  });
});

export default router;
