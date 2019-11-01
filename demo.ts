import { Client } from 'discord.js';
import { Command, Commander, Event, parse, subscribe } from './src/api';
import { LogLevels, LogTypes } from './src/lib/util/logging';

/* tslint:disable:max-classes-per-file */

class TestCommand extends Command('test') {
  @parse.nextWord private subCommand: string;
  @parse.remainingWords private arguments: string[];

  @subscribe('new', 'edit')
  public onMessage(ctx: Event) {
    ctx.message.reply(`${ctx.command} ${this.subCommand} [${this.arguments.join(', ')}]`);
  }
}

class PingCommand extends Command('ping') {
  @parse.nextChar private shouting: string;

  @subscribe('new')
  public onMessage(ctx: Event) {
    if (this.shouting === '!') {
      ctx.message.reply('pong!');
    } else {
      ctx.message.reply('pong');
    }
  }
}

class EchoCommand extends Command('echo') {
  @parse.remaining private toEcho: string;

  @subscribe('new')
  public onMessage(ctx: Event) {
    ctx.message.reply(this.toEcho);
  }
}

const commandRules = {
  [EchoCommand.commandName]: {
    noEmptyArgs: true,
  },
};

const commander = new Commander('$', [
  TestCommand,
  PingCommand,
  EchoCommand,
]);
commander.logLevel = 'debug';
commander.deleteProcessedCommands = true;

const client = new Client();

client.on('message', async (message) => {
  if (message.author.bot) { return; }
  if (! commander.isKnownCommand(message)) {
    console.log(`Demo: Found unknown command "${message.content}"`);
    return;
  }

  const [commandName, argumentString] = commander.parseCommand(message);
  if (commandName.toLowerCase() in commandRules)  {
    const rules = commandRules[commandName];
    console.log(`Demo: Found rules for command "${commandName}":`, rules);
    if (argumentString.trim().length === 0) {
      if (rules.noEmptyArgs) {
        console.log(`Demo: Command "${commandName}" requires an argument.`);
        return;
      }
    }
  }
  console.log(`Demo: Handling command "${commandName} ${argumentString}"`);
  commander.handleMessage('new', message);
});

const logLevel = process.argv[2] as LogLevels;
if (new Set(['verbose', 'info', 'silent', 'warning', 'debug']).has(logLevel)) {
  commander.logLevel = logLevel;
}

//  tslint:disable-next-line:no-var-requires
const { discord_secret } = require('./secrets.json');
client.login(discord_secret)
  .then(() => console.info(`Login successful`))
  .catch((err) => {
    console.error(`Login failed`);
    throw err;
  });
