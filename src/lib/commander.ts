import { Client, Message } from 'discord.js';
import { ICommandInstance, ICommandStatic } from './command';
import { parseCommand } from './commandParser';
import { Event } from './event';
import { EventType } from './interfaces/metadata';
import { metadata } from './util/metadata';
import { escapeRegex } from './util/regex';

export class Commander {
  public allowBots = false;
  public deleteUnknownCommands = true;
  public deleteProcessedCommands = true;

  private registeredCommands = new Map<string, ICommandInstance>();
  constructor(private prefix: string, commands: ICommandStatic[]) {
    commands.forEach((Comm) => {
      this.registeredCommands.set(Comm.commandName, new Comm());
    });
  }

  public start(client: Client) {
    this.setupEventHandlers(client);
  }

  private setupEventHandlers(client: Client) {
    const eventHandler = async (eventName: EventType, message: Message) => {
      // Exclude none commands
      if (! message.content.startsWith(this.prefix)) { return; }
      // Exclude messages sent by bots
      if ((! this.allowBots) && message.author.bot) { return; }

      const commandRegex = new RegExp(`^${escapeRegex(this.prefix)}(${
        [...this.registeredCommands.keys()].map(escapeRegex).join('|')
      })`);
      const commandMatch = message.content.match(commandRegex);

      // Exclude messages not containing valid commands
      if (!commandMatch) {
        if (this.deleteUnknownCommands && message.deletable) {
          await message.delete();
        }
        return;
      }

      const argumentString = message.content.substring(commandMatch[0].length);
      this.registeredCommands.forEach((comm) => {
        // No need to do any work for commands that aren't subscribed to the event.
        if (metadata.get(comm, 'subscribers')[eventName].length === 0) { return; }

        applyArguments(comm, argumentString);
        callAllListeners(comm, eventName, message);
      });

      if (this.deleteProcessedCommands && message.deletable) {
        try {
          await message.delete();
        } catch {
          // The message might have been deleted by one of the subscribers
        }
      }
    };

    const callAllListeners = (comm: ICommandInstance, eventName: EventType, message: Message) => {
      const meta = metadata.get(comm);

      meta.subscribers[eventName].forEach((propertyName) => {
        // Construct event
        const event = new Event({
          message,
          channel: message.channel,
          author: message.author,
          command: meta.name,
          event: {
            type: eventName,
            time: new Date(),
          },
        });
        comm[propertyName](event);
      });
    };

    const applyArguments = async (comm: ICommandInstance, argumentString: string) => {
      const meta = metadata.get(comm);

      const parserResults = parseCommand({
        msgToParse: argumentString,
        argumentParsers: meta.argumentParsers,
      });

      // Apply argument values
      Array(parserResults.matches.length)
        .fill(0) // fixes wonky array prototype
        .forEach((_, i) => {
          const argParser =  meta.argumentParsers[i];
          const matches = parserResults.matches[i];
          argParser.assignValue(matches);
        });
    };

    client.on('message', async (message) => eventHandler('new', message));
    client.on('messageUpdate', async (_, newMessage) => eventHandler('edit', newMessage));
  }
}