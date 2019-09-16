import { Client } from 'discord.js';
import { ICommandInstance, ICommandStatic } from './command';
import { getMetadata } from './metadata.utils';

export class Commander {
  private registeredCommands = new Map<string, ICommandInstance>();
  private prefix: string;
  constructor(prefix: string, commands: ICommandStatic[]) {
    this.prefix = prefix;
    commands.forEach((Comm) => {
      this.registeredCommands.set(Comm.commandName, new Comm());
    });
  }

  public start(client: Client) {
    this.setupEventHandlers(client);
  }

  private setupEventHandlers(client: Client) {
    this.registeredCommands.forEach((comm) => {
      const metadata = getMetadata(comm);
      const subscribedEvents = Object.keys(metadata.subscribers);
      const callAllListeners = (eventName: string, args: any[]) =>
        metadata.subscribers[eventName].forEach((propertyName) =>
          comm[propertyName](...args),
        );
      const realEventNamesWithHandlers = subscribedEvents.map((customEventName) => {
        const handler = (...args) => {
          callAllListeners(customEventName, args);
        };
        const eventMap =  new Map([
          ['new', 'message'],
          ['edit', 'messageUpdate'],
        ]);
        return { handler, name: eventMap.get(customEventName) };
      });
      realEventNamesWithHandlers.forEach((ctx) => {
        client.on(ctx.name, ctx.handler);
      });
    });
  }
}
