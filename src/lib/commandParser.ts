import { IArgumentParser } from './interfaces/argumentParser';

export const parseCommand = (args: {
  msgToParse: string,
  argumentParsers: IArgumentParser[],
}): { msgRest: string, matches: Array<string | string[]> } => {
  const patterns = args.argumentParsers.map((argParser) => argParser.regex);

  const result = patterns.reduce((res, pattern) => {
    const execAndStore = (regex: RegExp, matches: string[]) => {
      exp.lastIndex = 0;
      const regexResult = exp.exec(res.restOfMessage);
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
    } else {
      // only include the first match found (this makes the regex authoring simpler for the user)
      execAndStore(exp, output);
    }

    res.matches.push(output);
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
