import { APP_CONFIG } from '../config/app.config';

export function generateSafeFileName(originalName: string): string {
  const timestamp = Date.now();
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');

  const sanitized = sanitizeFileName(originalName);
  const lastDotIndex = sanitized.lastIndexOf('.');
  const baseName = lastDotIndex > 0 ? sanitized.substring(0, lastDotIndex) : sanitized;
  const extension = lastDotIndex > 0 ? sanitized.substring(lastDotIndex + 1) : '';

  const safeBase = baseName
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9\-_]/g, '')
    .toLowerCase();

  const finalBase = safeBase || 'archivo';
  const finalExt = extension || 'bin';

  return APP_CONFIG.fileNamePattern
    .replace('{prefix}', APP_CONFIG.gcsPrefix)
    .replace('{year}', year)
    .replace('{month}', month)
    .replace('{timestamp}', String(timestamp))
    .replace('{slug}', finalBase)
    .replace('{original}', finalBase)
    .replace('{ext}', finalExt);
}

export function sanitizeFileName(fileName: string): string {
  if (!fileName || fileName.trim().length === 0) {
    return 'archivo-desconocido';
  }

  let sanitized = fileName.trim();

  // Remove path traversal attempts
  sanitized = sanitized.replace(/\.\./g, '');
  sanitized = sanitized.replace(/[\\/]/g, '-');

  // Remove control characters and dangerous symbols
  sanitized = sanitized.replace(/[<>:"|?*\x00-\x1f]/g, '');

  return sanitized;
}

export function extractOriginalNameFromGcsName(gcsName: string): string {
  const parts = gcsName.split('/');
  const filePart = parts[parts.length - 1];

  // Pattern: timestamp-slug-original.ext
  const match = filePart.match(/^\d+-(.*?)-(.+?)(\.[^.]+)$/);
  if (match) {
    return `${match[2]}${match[3]}`;
  }

  return filePart;
}
