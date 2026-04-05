import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_URL:
    process.env.APP_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    `http://localhost:${Number(process.env.PORT) || 5000}`,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'access_secret_key',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'refresh_secret_key',
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || '15m',
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || '7d',

  SESSION_SECRET: process.env.SESSION_SECRET || 'session_secret_key',

  DATABASE_URL: process.env.DATABASE_URL || '',
  MONGO_URI: process.env.MONGO_URI || '',
};
