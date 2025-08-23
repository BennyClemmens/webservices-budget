export default {
  log: {
    level: 'silly',
    disabled: false,
  },
  cors: {
    origins: ['http://localhost:5173'], // not yet known
    maxAge: 3 * 60 * 60,
  },
};
