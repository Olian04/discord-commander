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

const commander = new Commander('$', [
  TestCommand,
  PingCommand,
  EchoCommand,
]);
commander.deleteProcessedCommands = true;

const client = new Client();

client.on('message', async (message) => {
  commander.handleMessage('new', message);
});
client.on('messageUpdate', (message) => {
  commander.handleMessage('edit', message);
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
