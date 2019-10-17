import { IArgumentParser } from './argumentParser';

export type EventType = 'new' | 'edit';

export interface IMetadata {
  argumentParsers: IArgumentParser[];
  subscribers: {
    [key in EventType]: string[]
  };
  name: string;
}
