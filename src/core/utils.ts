import crypto from 'crypto';

export const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

export const generateId = (): string => {
  return crypto.randomUUID();
};

export const getCurrentDate = (): string => {
  return new Date().toISOString();
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};