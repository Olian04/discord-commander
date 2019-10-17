import { Client } from 'discord.js';
import { Command, Commander, Event, parse, subscribe } from './src/api';

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

const commander = new Commander('$', [
  TestCommand,
  PingCommand,
]);
commander.deleteProcessedCommands = true;

const client = new Client();
commander.start(client);

//  tslint:disable-next-line:no-var-requires
const { discord_secret } = require('./secrets.json');
client.login(discord_secret)
  .then(() => console.info(`Login successful`))
  .catch((err) => {
    console.error(`Login failed`);
    throw err;
  });
