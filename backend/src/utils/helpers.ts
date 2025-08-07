import jwt, { SignOptions } from 'jsonwebtoken';

export const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  return jwt.sign({ id }, secret, { expiresIn: '7d' });
};

export const formatResponse = <T>(data: T, message?: string) => {
  return {
    success: true,
    data,
    message,
  };
};

export const formatError = (message: string, statusCode: number = 400) => {
  const error = new Error(message) as any;
  error.statusCode = statusCode;
  return error;
};

export const getPagination = (page: number = 1, limit: number = 10) => {
  const offset = (page - 1) * limit;
  return { offset, limit };
};

export const getPaginationData = (count: number, page: number, limit: number) => {
  const totalPages = Math.ceil(count / limit);
  return {
    page,
    limit,
    total: count,
    pages: totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};