import * as dotenv from 'dotenv';

dotenv.config();

export const jwtConstants = {
  secret: process.env.SESSION_TOKEN_NAME,
  expirationTime: 21600,
  emailConfirmUrl: 'http://localhost:3000/confirm-email',
};

export const emailServiceConfig = {
  service: process.env.EMAIL_SERVICE,
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASSWORD,
};

export const mongoURI = 'mongodb://localhost/auth';

export const SESSION_TOKEN_NAME = process.env.SESSION_TOKEN_NAME || 'token';

export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
