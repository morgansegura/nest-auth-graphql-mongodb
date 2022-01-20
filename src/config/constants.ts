import * as dotenv from 'dotenv';

dotenv.config();

export const jwtConstants =
  '2349879weuffwehriowejr20384asdalskdja90rwe90ruksjdfklj8798475';

export const mongoURI = 'mongodb://localhost/auth';

export const SESSION_TOKEN_NAME = process.env.SESSION_TOKEN_NAME || 'token';

export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
