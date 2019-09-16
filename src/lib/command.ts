import { Event } from '../api';

export interface ICommandStatic {
  commandName: string;
  new(...args): ICommandInstance;
}

export interface ICommandInstance {
}

export const CommandFactory = (name: string): ICommandStatic =>
  class Command implements ICommandInstance {
    public static commandName =  name;
  };
