import { IArgumentParser } from './interfaces/argumentParser';
import { logger } from './util/logging';

export const parseCommand = (args: {
  msgToParse: string,
  argumentParsers: IArgumentParser[],
}): { msgRest: string, matches: Array<string | string[]> } => {
  logger.debug(`Parsing command:`, args);
  const patterns = args.argumentParsers.map((argParser) => argParser.regex);

  const result = patterns.reduce((res, pattern) => {
    const execAndStore = (regex: RegExp, matches: string[]) => {
      regex.lastIndex = 0;
      const regexResult = regex.exec(res.restOfMessage);
      if (! regexResult) { return false; }
      const [fullMatch, ...groups] = regexResult;

      res.restOfMessage = res.restOfMessage.substring(fullMatch.length);
      matches.push(...groups);
      return true;
    };

    const exp = new RegExp(pattern);
    const output = [];

    if (exp.flags.toLowerCase().indexOf('g') > -1) {
      // g was provided as a flag, aka include all global matches
      while (execAndStore(exp, output)) { /* the body of the while is unnecessary */ }
      res.matches.push(output);
    } else {
      // only include the first match found (this makes the regex authoring simpler for the user)
      execAndStore(exp, output);
      res.matches.push(output[0]);
    }

    return res;
  }, {
    restOfMessage: args.msgToParse,
    matches: [],
  });

  return {
    msgRest: result.restOfMessage,
    matches: result.matches || [],
  };
};
