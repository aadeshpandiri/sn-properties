const isDev = process.env.NODE_ENV === 'development';

const logger = {
  info: (message, data) => {
    if (isDev) console.log(`[INFO] ${message}`, data ?? '');
  },
  warn: (message, data) => {
    console.warn(`[WARN] ${message}`, data ?? '');
  },
  error: (message, error) => {
    console.error(`[ERROR] ${message}`, error ?? '');
  },
  debug: (message, data) => {
    if (isDev) console.debug(`[DEBUG] ${message}`, data ?? '');
  },
};

export default logger;
