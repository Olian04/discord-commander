import { Client } from 'discord.js';
import { Command, Commander, Event, subscribe } from './src/api';

class TestCommand extends Command('test') {

  @subscribe('new')
  public onMessage(ctx: Event) {
    console.log(ctx.message.content);
  }
}

const commander = new Commander('!', [
  TestCommand,
]);

const client = new Client();
commander.start(client);
// client.login(discord_secret); // TODO: Fetch discord secret
