import dotenv from 'dotenv';

dotenv.config();

export const SUPPORTED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
export const SWAGGER_HOST =
  process.env.NODE_ENV === 'development' ? 'localhost:3001' : process.env.API_HOST_URL;
