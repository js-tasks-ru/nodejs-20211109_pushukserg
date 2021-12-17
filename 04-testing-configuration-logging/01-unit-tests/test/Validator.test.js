const Validator = require('../Validator');
const expect = require('chai').expect;

const getType = (byString) => byString ? 'string' : 'number';
const getReverseType = (byString) => getType(!byString);
const generateString = (strLength) => (new Array(strLength)).fill('a').join('');
const valueByRulesFactory = (min, max, byString) => (key) => {
  switch (key) {
    case 'typeKeySuccess':
      return byString ? generateString((min + max) / 2) : (min + max) / 2;
    case 'typeKeyError':
      return byString ? (min + max) / 2 : generateString((min + max) / 2);
    case 'beforeMin':
      return byString ? generateString(min - 1) : min - 1;
    case 'min':
      return byString ? generateString(min) : min;
    case 'max':
      return byString ? generateString(max) : max;
    case 'afterMax':
      return byString ? generateString(max + 1) : max + 1;
    case 'success':
      return byString ? generateString((min + max) / 2) : (min + max) / 2;
  }
};

const blockMessageFacroty = (key, byString) => {
  switch (key) {
    case 'typeKeySuccess':
      return `проверка типа данных: ${byString ? 'string' : 'number'}`;
    case 'typeKeyError':
      return `проверка типа данных: ${byString ? 'number' : 'number'}`;
    case 'beforeMin':
      return `проверка: ${byString ? 'строка.length' : 'число'} < min`;
    case 'min':
      return `проверка: ${byString ? 'строка.length' : 'число'} == min`;
    case 'max':
      return `проверка: ${byString ? 'строка.length' : 'число'} == max`;
    case 'afterMax':
      return `проверка: ${byString ? 'строка.length' : 'число'} > max`;
    case 'success':
      return `проверка: min < ${byString ? 'строка.length' : 'число'} < max`;
  }
};

const expectCommonError = (key, errors) => {
  expect(errors).to.have.length(1);
  expect(errors[0]).to.have.property('field').and.to.be.equal(key);
};

const expecting = ({key, val, errors, byString, min, max}) => {
  switch (key) {
    case 'typeKeySuccess':
    case 'min':
    case 'max':
    case 'success':
      expect(errors).to.have.length(0);
      break;
    case 'typeKeyError':
      expectCommonError(key, errors);
      expect(errors[0]).to.have.property('error').and.to.be.equal(`expect ${getType(byString)}, got ${getReverseType(byString)}`);
      break;
    case 'beforeMin':
      expectCommonError(key, errors);
      expect(errors[0]).to.have.property('error').and.to.be.equal(`too ${byString ? 'short' : 'little'}, expect ${min}, got ${byString ? val.length : val}`);
      break;
    case 'afterMax':
      expectCommonError(key, errors);
      expect(errors[0]).to.have.property('error').and.to.be.equal(`too ${byString ? 'long' : 'big'}, expect ${max}, got ${byString ? val.length : val}`);
      break;
  }
};

const checkingValidator = (byString) => (key) => {
  it(blockMessageFacroty(key, byString), () => {
    const min = 10;
    const max = 20;

    const validator = new Validator({[key]: {type: byString ? 'string' : 'number', min, max}});
    const valueFactory = valueByRulesFactory(min, max, byString);
    const val = valueFactory(key);

    const errors = validator.validate({[key]: val});

    expecting({key, val, errors, byString, min, max});
  });
};

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    const CASES = [
      'typeKeySuccess',
      'typeKeyError',
      'beforeMin',
      'min',
      'max',
      'afterMax',
      'success',
    ];

    const stringValidate = checkingValidator(true);
    const numberValidate = checkingValidator(false);

    describe('валидатор проверяет строковые поля', () => {
      CASES.forEach((tCase) => {
        stringValidate(tCase);
      });
    });
    describe('валидатор проверяет числовые поля', () => {
      CASES.forEach((tCase) => {
        numberValidate(tCase);
      });
    });
  });
});
