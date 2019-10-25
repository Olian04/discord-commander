import { Client, Message } from 'discord.js';
import { ICommandInstance, ICommandStatic } from './command';
import { parseCommand } from './commandParser';
import { Event } from './event';
import { MessageHandlerResponse } from './interfaces/messageHandlerResponse';
import { EventType } from './interfaces/metadata';
import { logger, LogLevels } from './util/logging';
import { metadata } from './util/metadata';
import { escapeRegex } from './util/regex';

export class Commander {
  public allowBots = false;
  public deleteUnknownCommands = false;
  public deleteProcessedCommands = false;
  public set logLevel(newLogLevel: LogLevels) {
    logger.logLevel =  newLogLevel;
  }

  private registeredCommands = new Map<string, ICommandInstance>();
  constructor(private prefix: string, commands: ICommandStatic[]) {
    logger.info(`Initiating command registration.`);

    let commandsSkipped = 0;
    commands.forEach((Comm) => {
      if (this.registeredCommands.has(Comm.commandName)) {
        logger.warn(`Skipping command registration for command "${Comm.commandName}",  a command with that name already exists.`);
        commandsSkipped += 1;
        return;
      }
      this.registeredCommands.set(Comm.commandName, new Comm());
      logger.log(`Registered command "${Comm.commandName}"`);
    });
    logger.info(`Command registration concluded with ${commandsSkipped} warning(s).`);
  }

  public simpleSetup(client: Client) {
    logger.info(`Initiating simple setup.`);
    this.setupEventHandlers(client);
    logger.info(`Simple setup completed.`);
  }

  public async handleMessage(eventName: EventType, message: Message): Promise<MessageHandlerResponse> {
    // Exclude none commands
    if (! message.content.startsWith(this.prefix)) {
      return {
        status: 'skip',
        reason: 'exclude none commands',
        deleted: false,
      };
    }
    // Exclude messages sent by bots
    if ((! this.allowBots) && message.author.bot) {
      return {
        status: 'skip',
        reason: 'exclude messages sent by bots',
        deleted: false,
      };
    }

    const commandRegex = new RegExp(`^${escapeRegex(this.prefix)}(${
      [...this.registeredCommands.keys()].map(escapeRegex).join('|')
    })`);
    const commandMatch = message.content.match(commandRegex);

    // Exclude messages not containing valid commands
    if (!commandMatch) {
      const shouldAttemptDelete = this.deleteUnknownCommands && message.deletable;
      if (shouldAttemptDelete) {
        await message.delete();
      }
      return {
        status: 'skip',
        reason:  'exclude messages not containing valid commands',
        deleted: shouldAttemptDelete,
      };
    }

    const argumentString = message.content.substring(commandMatch[0].length);
    const comm = this.registeredCommands.get(commandMatch[1]);

    if (metadata.get(comm, 'subscribers')[eventName].length > 0) {
      this.applyArguments(comm, argumentString);
      await this.callAllListeners(comm, eventName, message);
    }

    if (this.deleteProcessedCommands && message.deletable) {
      try {
        await message.delete();
      } catch {
        // The message might have been deleted by one of the subscribers
      }
      return {
        status: 'ok',
        command:  commandMatch[0],
        deleted: true,
      };
    } else {
      return {
        status: 'ok',
        command:  commandMatch[0],
        deleted: false,
      };
    }
  }

  private async callAllListeners(comm: ICommandInstance, eventName: EventType, message: Message) {
    const meta = metadata.get(comm);

    return Promise.all(meta.subscribers[eventName].map(async (propertyName) => {
      logger.debug(`Firing event "${eventName}" on command "${meta.name}"`);

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
      // This allows the event handler to both be synchronous and asynchronous on the user end
      return Promise.resolve(comm[propertyName](event));
    }));
  }

  private async applyArguments(comm: ICommandInstance, argumentString: string) {
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
  }

  private setupEventHandlers(client: Client) {
    client.on('message', async (message) => this.handleMessage('new', message));
    client.on('messageUpdate', async (_, newMessage) => this.handleMessage('edit', newMessage));
  }
}
