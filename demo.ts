import { Client } from 'discord.js';
import { Command, Commander, Event, parse, subscribe } from './src/api';

class TestCommand extends Command('test') {
  @parse.nextWord private subCommand: string;
  @parse.remainingWords private arguments: string[];

  @subscribe('new', 'edit')
  public onMessage(ctx: Event) {
    ctx.message.reply(`${ctx.command} ${this.subCommand} [${this.arguments.join(', ')}]`);
  }
}

const commander = new Commander('$', [
  TestCommand,
]);

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
