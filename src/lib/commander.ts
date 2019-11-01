import { Client, Message } from 'discord.js';
import { ICommandInstance, ICommandStatic } from './command';
import { parseCommand } from './commandParser';
import { Event } from './event';
import { MessageHandlerResponse } from './interfaces/messageHandlerResponse';
import { EventType } from './interfaces/metadata';
import { debugPrintObject } from './util/debugPrintObject';
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
/**
 *
 * @memberof Commander
 * @returns True if the message starts with the correct prefix followed by a known command name.
 */
  public isKnownCommand(message: Message): boolean {
    // Exclude messages not containing valid commands
    const [commandName] = this.parseCommand(message);
    return commandName !== null;
  }

/**
 *
 * @memberof Commander
 * @returns An array with two elements
 *  - the first is the command name if the message contains a known command. Otherwise its null.
 *  - the second is the args string if there is one. Otherwise its null.
 */
  public parseCommand(message: Message): [string | null, string | null] {
    const commandRegex = new RegExp(`^${escapeRegex(this.prefix)}(${
      [...this.registeredCommands.keys()].map(escapeRegex).join('|')
    })((?:\\s|\\S)*)$`);
    const maybeMatch = message.content.match(commandRegex);

    logger.debug(debugPrintObject('Commander.parseCommand', {
      input: message.content,
      regex: commandRegex.source,
      match: maybeMatch,
    }));

    // Exclude messages not containing valid
    return maybeMatch ? [maybeMatch[1], maybeMatch[2]] : [null, null];
  }

  public async handleMessage(eventName: EventType, message: Message): Promise<MessageHandlerResponse> {
    // Exclude none commands
    if (! this.isKnownCommand(message)) {
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

    const [commandName, argumentString] = this.parseCommand(message);

    // Exclude messages not containing valid commands
    if (!commandName) {
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

    const comm = this.registeredCommands.get(commandName);

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
        command: message.content,
        deleted: true,
      };
    } else {
      return {
        status: 'ok',
        command: message.content,
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
