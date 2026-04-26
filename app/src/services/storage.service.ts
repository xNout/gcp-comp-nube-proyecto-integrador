import { Storage } from '@google-cloud/storage';
import { APP_CONFIG } from '../config/app.config';
import { generateSafeFileName, extractOriginalNameFromGcsName } from '../utils/file-name.util';

const storage = new Storage();
const bucket = storage.bucket(APP_CONFIG.gcpBucketName);

export interface EvidenceFile {
  name: string;
  originalName: string;
  size: number;
  contentType: string;
  updatedAt: string;
}

export async function uploadFile(
  buffer: Buffer,
  originalName: string,
  mimeType: string
): Promise<string> {
  const destination = generateSafeFileName(originalName);
  const file = bucket.file(destination);

  await file.save(buffer, {
    contentType: mimeType,
    metadata: {
      metadata: {
        originalName,
        uploadedAt: new Date().toISOString(),
      },
    },
  });

  return destination;
}

export async function listFiles(): Promise<EvidenceFile[]> {
  const [files] = await bucket.getFiles({
    prefix: APP_CONFIG.gcsPrefix,
    maxResults: APP_CONFIG.maxListItems,
  });

  return files.map((file) => {
    const metadata = file.metadata;
    return {
      name: file.name,
      originalName:
        (metadata.metadata?.originalName as string) ||
        extractOriginalNameFromGcsName(file.name),
      size: Number(metadata.size || 0),
      contentType: String(metadata.contentType || 'application/octet-stream'),
      updatedAt: String(metadata.updated || new Date().toISOString()),
    };
  });
}

export async function getFileStream(fileName: string) {
  const file = bucket.file(fileName);
  const [exists] = await file.exists();
  if (!exists) {
    return null;
  }

  const [metadata] = await file.getMetadata();
  const stream = file.createReadStream();

  return {
    stream,
    contentType: String(metadata.contentType || 'application/octet-stream'),
    originalName:
      (metadata.metadata?.originalName as string) ||
      extractOriginalNameFromGcsName(fileName),
  };
}
