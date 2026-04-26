import { ENV } from './env';

export const APP_CONFIG = {
  serviceName: 'cloud-evidence-app',
  port: ENV.PORT,
  nodeEnv: ENV.NODE_ENV,
  isProduction: ENV.NODE_ENV === 'production',
  gcpBucketName: ENV.GCP_BUCKET_NAME,
  gcsPrefix: ENV.GCS_PREFIX,
  maxFileSizeBytes: ENV.MAX_FILE_SIZE_MB * 1024 * 1024,
  maxListItems: 50,
  allowedMimeTypes: [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  routes: {
    home: '/',
    upload: '/upload',
    evidences: '/evidences',
    download: '/evidences/:encodedName/download',
    health: '/health',
  },
  fileNamePattern: '{prefix}/{year}/{month}/{timestamp}-{slug}-{original}.{ext}',
  viewEngine: 'ejs',
  viewsPath: 'src/views',
  staticPath: 'public',
  helmetOptions: {},
  morganFormat: 'combined',
} as const;
