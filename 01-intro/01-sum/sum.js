function sum(a, b) {
  [a, b].forEach((v) => {
    if (typeof v !== 'number' || isNaN(v)) throw new TypeError();
  });

  return a + b;
}

module.exports = sum;
