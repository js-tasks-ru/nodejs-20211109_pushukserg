const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.encoding = options.encoding;
    this.counter = 0;
  }

  _transform(chunk, encoding, callback) {
    this.counter += chunk.byteLength;
    if (this.counter > this.limit) {
      this.counter = 0;
      return callback(new LimitExceededError(), null);
    }

    return callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
