export default {
  jwt: {
    secret: process.env.APP_SECRET || 'undefined',
    expiresIn: '1d',
  },
};
