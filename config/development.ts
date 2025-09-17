export default {
  log: {
    level: 'debug',
    disabled: false,
  },
  cors: {
    origins: ['http://localhost:5173'], // zonder /
    maxAge: 3 * 60 * 60, // 3u
  },
  auth: {
    maxDelay: 5000, //ms (5 seconds)
    argon: {
      hashLength: 32,
      timeCost: 6,
      memoryCost: 2 ** 17,
    },
    jwt: {
      audience: 'budget.hogent.be',
      issuer: 'budget.hogent.be',
      expirationInterval: 60 * 60, // s (1 hour)
      secret:
        'eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked',
    },
  },
};
