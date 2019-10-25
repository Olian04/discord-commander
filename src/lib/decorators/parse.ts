import { callableObject } from 'ts-callable-object';
import { debugPrintObject } from '../util/debugPrintObject';
import { logger } from '../util/logging';
import { metadata } from '../util/metadata';

const parseFunction = (regex: RegExp) => (target: object, key: string) => {
  logger.debug(debugPrintObject('Parse', {
    commandName: metadata.get(target, 'name'),
    regex,
    propertyKey: key,
  }));

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
    set: (newValue) => {
      value = newValue;
    },
    enumerable: true,
  });
};

export const parse = callableObject(parseFunction, {
  nextWord: parseFunction(/\s([a-z][a-z0-9]*)/i),
  remainingWords: parseFunction(/\s([a-z][a-z0-9]*)/ig),
  nextChar: parseFunction(/(\S)/i),
  remainingChars: parseFunction(/(\S)/ig),
  nextNumber: parseFunction(/([0-9]+(?:\.[0-9]+)?)/i),
  remainingNumbers: parseFunction(/([0-9]+(?:\.[0-9]+)?)/ig),
  remaining: parseFunction(/^(.*)$/i),
});
