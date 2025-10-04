export const ENV = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret-key',
};