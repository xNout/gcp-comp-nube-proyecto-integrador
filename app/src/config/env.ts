import dotenv from 'dotenv';

dotenv.config();

function getEnvString(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (value === undefined || value === '') {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is required but not set.`);
  }
  return value;
}

function getEnvNumber(key: string, defaultValue?: number): number {
  const value = process.env[key];
  if (value === undefined || value === '') {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is required but not set.`);
  }
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a valid number.`);
  }
  return parsed;
}

export const ENV = {
  NODE_ENV: getEnvString('NODE_ENV', 'development'),
  PORT: getEnvNumber('PORT', 3000),
  GCP_BUCKET_NAME: getEnvString('GCP_BUCKET_NAME'),
  MAX_FILE_SIZE_MB: getEnvNumber('MAX_FILE_SIZE_MB', 10),
  GCS_PREFIX: getEnvString('GCS_PREFIX', 'evidencias'),
} as const;
