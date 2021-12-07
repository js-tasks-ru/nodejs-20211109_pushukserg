const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  req.on('error', () => {
    res.statusCode = 500;
    res.end();
  });

  switch (req.method) {
    case 'GET':
      if (pathname.indexOf('/') >= 0) {
        res.statusCode = 400;
        res.end();
      }

      fs.createReadStream(filepath).on('error', () => {
        res.statusCode = 404;
        res.end();
      }).pipe(res);

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
