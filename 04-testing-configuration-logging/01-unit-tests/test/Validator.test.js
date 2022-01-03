const Validator = require('../Validator');
const expect = require('chai').expect;

const RULE_MIN = 10;
const RULE_MAX = 20;
const commonValues = {};
const commonRules = {};
const setCommonValuesAndRules = (strKey, strValue, fType) => {
  if (!commonValues[fType + strKey]) {
    commonValues[fType + strKey] = strValue;
    commonRules[fType + strKey] = {
      type: fType,
      min: RULE_MIN,
      max: RULE_MAX,
    };
  }
};

const getType = (byString) => byString ? 'string' : 'number';
const getReverseType = (byString) => getType(!byString);
const generateString = (strLength) => (new Array(strLength)).fill('a').join('');
const valueByRulesFactory = (min, max, byString) => (key) => {
  let value = null;
  switch (key) {
    case 'typeKeySuccess':
      value = byString ? generateString((min + max) / 2) : (min + max) / 2;
      break;
    case 'typeKeyError':
      value = byString ? min - 1 : generateString(min - 1);
      break;
    case 'beforeMin':
      value = byString ? generateString(min - 1) : min - 1;
      break;
    case 'min':
      value = byString ? generateString(min) : min;
      break;
    case 'max':
      value = byString ? generateString(max) : max;
      break;
    case 'afterMax':
      value = byString ? generateString(max + 1) : max + 1;
      break;
    case 'success':
      value = byString ? generateString((min + max) / 2) : (min + max) / 2;
      break;
  }
  // Generate object for multiple fields test
  setCommonValuesAndRules(key, value, getType(byString));
  return value;
};

const blockMessageFacroty = (key, byString) => {
  switch (key) {
    case 'typeKeySuccess':
      return `проверка типа данных: ${getType(byString)}`;
    case 'typeKeyError':
      return `проверка типа данных: ${getReverseType(byString)}`;
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
    default:
      return `проверка работы с множеством полей`;
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

const multipleExpecting = (errors) => {
  expect(errors).to.have.length(6);
  expect(errors[0]).to.have.property('field').and.to.be.equal('stringtypeKeyError');
  expect(errors[1]).to.have.property('field').and.to.be.equal('stringbeforeMin');
  expect(errors[2]).to.have.property('field').and.to.be.equal('stringafterMax');
  expect(errors[3]).to.have.property('field').and.to.be.equal('numbertypeKeyError');
  expect(errors[4]).to.have.property('field').and.to.be.equal('numberbeforeMin');
  expect(errors[5]).to.have.property('field').and.to.be.equal('numberafterMax');

  expect(errors[0]).to.have.property('error').and.to.be.equal(`expect ${commonRules[errors[0].field].type}, got ${typeof commonValues[errors[0].field]}`);
  expect(errors[1]).to.have.property('error').and.to.be.equal(`too short, expect ${commonRules[errors[1].field].min}, got ${commonValues[errors[1].field].length}`);
  expect(errors[2]).to.have.property('error').and.to.be.equal(`too long, expect ${commonRules[errors[2].field].max}, got ${commonValues[errors[2].field].length}`);
  expect(errors[3]).to.have.property('error').and.to.be.equal(`expect ${commonRules[errors[3].field].type}, got ${typeof commonValues[errors[3].field]}`);
  expect(errors[4]).to.have.property('error').and.to.be.equal(`too little, expect ${commonRules[errors[4].field].min}, got ${commonValues[errors[4].field]}`);
  expect(errors[5]).to.have.property('error').and.to.be.equal(`too big, expect ${commonRules[errors[5].field].max}, got ${commonValues[errors[5].field]}`);
};

const checkingValidator = (byString = 'multiple') => (key) => {
  if (byString === 'multiple') {
    it(blockMessageFacroty(), () => {
      const validator = new Validator(commonRules);

      const errors = validator.validate(commonValues);

      multipleExpecting(errors);
    });
  } else {
    it(blockMessageFacroty(key, byString), () => {
      const validator = new Validator({[key]: {type: byString ? 'string' : 'number', min: RULE_MIN, max: RULE_MAX}});
      const valueFactory = valueByRulesFactory(RULE_MIN, RULE_MAX, byString);
      const val = valueFactory(key);

      const errors = validator.validate({[key]: val});
      expecting({key, val, errors, byString, min: RULE_MIN, max: RULE_MAX});
    });
  }
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
    const multipleValidate = checkingValidator();

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
    describe('валидатор проверяет множество значений', () => {
      multipleValidate();
    });
  });
});
