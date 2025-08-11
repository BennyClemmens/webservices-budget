export default {
  log: {
    level: 'info',
    disabled: true,
  },
  cors: {
    origins: ['http://localhost:5173'], // not yet known
    maxAge: 3 * 60 * 60,
  },
};
