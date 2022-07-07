// tiny wrapper with default env vars
export default {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  MOCK: process.env.MOCK || false,
};
