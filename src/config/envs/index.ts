process.env.NODE_ENV = process.env.NODE_ENV || 'local';

export const isProduction = process.env.NODE_ENV === 'production';
export const envs = process.env
