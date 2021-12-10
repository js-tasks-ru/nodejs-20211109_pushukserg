const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    options = Object.assign({}, options, {
      decodeStrings: false,
    });
    super(options);

    this.strInMem = '';
  }

  _transform(chunk, encoding, callback) {
    let line = '';

    const eolParser = (str) => {
      const idx = str.indexOf(os.EOL);

      if (idx >= 0) {
        const beforeEOL = str.slice(0, idx);
        const afterEOL = str.slice(idx + 1);

        this.push(beforeEOL);

        eolParser(afterEOL);
      } else {
        line += str;
      }
    };

    eolParser(this.strInMem + chunk);
    this.strInMem = line;
    callback();
  }

  _flush(callback) {
    if (this.strInMem) {
      this.push(this.strInMem);
    }
    callback();
  }
}

module.exports = LineSplitStream;
