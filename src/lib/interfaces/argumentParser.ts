export interface IArgumentParser {
  regex: RegExp;
  assignValue: (value: string | string[]) => void;
}
