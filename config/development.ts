export default {
  log: {
    level: 'debug',
    disabled: false,
  },
  cors: {
    origins: ['http://localhost:5173'], // zonder /
    maxAge: 3 * 60 * 60, // 3u
  },
};
