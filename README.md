# discordjs-commander
A command manager for discord.js bots.

```ts
import { Client } from 'discord.js' 
import { Commander, Command } from 'discordjs-commander';

class EchoCommand extends Command('echo') {
  @option('c') private capitalize = false;
  @option() private debug = false;
  
  @subscribe('new', 'edit')
  private onMessage(cmd) {
    const {
      options: { capitalize, debug },
      argument,
      author,
      channel,
      message,
      event: { type: 'new' | 'edit' }
    } = cmd;
  }
}

const commander = new Commander([
  EchoCommand,
]);

const client = new Client();
commander.start(client);
client.login(discord_secret);
```
