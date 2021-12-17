const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

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

  let inProgress = true;

  req.on('error', () => {
    removeFile();
    responseHandler(500);
  });
  req.on('close', () => {
    if (inProgress) {
      removeFile();
    }
    responseHandler(500);
  });

  switch (req.method) {
    case 'POST':
      if (pathname.indexOf('/') >= 0) {
        responseHandler(400);
        break;
      }
      fs.access(filepath, fs.F_OK, (err) => {
        if (err) {
          const limitedStream = new LimitSizeStream({limit: 1024 * 1024, encoding: 'utf-8'});
          const w = fs.createWriteStream(filepath);


          limitedStream.on('error', () => {
            responseHandler(413);
            removeFile();
          });
          limitedStream.on('finish', () => {
            inProgress = false;
            responseHandler(201);
          });
          req.pipe(limitedStream).pipe(w);
        } else {
          inProgress = false;
          responseHandler(409);
        }
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
