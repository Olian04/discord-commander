import { callableObject } from '../util/callableObject';
import { metadata } from '../util/metadata';

const parseFunction = (regex: RegExp) => (target: object, key: string) => {
  let value: string | string[] = null;
  metadata.update(target, (meta) => {
    meta.argumentParsers.push({
      regex, assignValue: (val) => {
        value = val;
      },
    });
    return meta;
  });
  Object.defineProperty(target, key, {
    get: () => value,
    set: () => {
      throw new Error(`Commander: Unable to set property "${key}" since its a calculated value.`);
    },
    enumerable: true,
  });
};

export const parse = callableObject(parseFunction, {
  nextWord: parseFunction(/\s([a-z][a-z0-9]*)/i),
  remainingWords: parseFunction(/\s([a-z][a-z0-9]*)/ig),
  nextChar: parseFunction(/([a-z])/i),
  remainingChars: parseFunction(/([a-z])/ig),
  nextNumber: parseFunction(/([0-9]+(?:\.[0-9]+)?)/i),
  remainingNumbers: parseFunction(/([0-9]+(?:\.[0-9]+)?)/ig),
  rest: parseFunction(/.*/i),
});
