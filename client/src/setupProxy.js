const { createProxyMiddleware } = require('http-proxy-middleware');

const setupProxy = app => {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://0.0.0.0:3001',
      changeOrigin: true,
    }),
  );
};

module.exports = setupProxy;
