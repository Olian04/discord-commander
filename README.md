# discordjs-commander
A command manager for discord.js bots.

```ts
import { Client } from 'discord.js' 
import { Commander, Command, option, subscribe } from 'discordjs-commander';
import { HelpCommand, help } from 'discordjs-commander/commands/help';

class EchoCommand extends Command('echo') {
  @option('c') private capitalize = false;
  @option() private debug = false;
  @help private helpText = 
    'echo [option] <phrase to echo>' +
    '  --capitalize -c | Capitalizes the echoed text. (default: false)' +
    '  --debug         | Enables debug logging. (default: false)';
  
  
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

const commander = new Commander('!', [
  EchoCommand,
  HelpCommand,
]);

const client = new Client();
commander.start(client);
client.login(discord_secret);
```

```
!help
Syntax: !commandName [options] <argument>
  echo [options] <argument>
    --capitalize -c | Capitalizes the echoed text. (default: false)
    --debug         | Enables debug logging. (default: false)
```

## Install

1. Install library: [`npm i discordjs-commander`](#).
2. Enable `experimentalDecorators` and `emitDecoratorMetadata` in `tsconfig.json`.
3. Try the example above.

_Note: If you are using vscode you might need to set `javascript.implicitProjectConfig.experimentalDecorators` to `true` in the workspace settings._

## Development

1. Grab your discord-bot secret from the [discord developer portal](https://discordapp.com/developers/applications).
2. Create a `secrets.json` file and store your discord-bot secret as `discord_token` inside it.
3. Install dependencies: `npm i`.
4. Start demo: `npm run demo:start`.
