import { metadata } from './util/metadata';

export interface ICommandStatic {
  commandName: string;
  new(): ICommandInstance;
}

export interface ICommandInstance {
}

export const CommandFactory = (name: string): ICommandStatic =>
  class Command implements ICommandInstance {
    public static commandName =  name;
    constructor() {
      metadata.set(this, 'name', name);
    }
  };
