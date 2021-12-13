const fs = require('fs');
const http = require('http');
const path = require('path');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  const responseHandler = (errCode) => {
    res.statusCode = errCode;
    res.end();
  };

  const removeFile = () => {
    fs.unlink(filepath, (err) => {
      if (err) console.log('No file to remove');
      console.log(`${filepath} was deleted`);
    });
  };

  req.on('error', () => {
    responseHandler(500);
  });

  switch (req.method) {
    case 'DELETE':
      if (pathname.indexOf('/') >= 0) {
        responseHandler(400);
        break;
      }
      fs.access(filepath, fs.F_OK, (err) => {
        if (err) {
          responseHandler(404);
        } else {
          removeFile();
          responseHandler(200);
        }
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
