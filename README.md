# discordjs-commander
A command manager for discord.js bots.

```ts
import { Client } from 'discord.js' 
import { Commander, Command, option, subscribe } from 'discordjs-commander';
import { HelpCommand, help } from 'discordjs-commander/commands/help';

class EchoCommand extends Command('echo') {
  @option('c') private capitalize = false;
  @option() private debug = false;
  @help() private helpText = 
    'echo [options] phraseToEcho' +
    'Echos the given phrase back to the user.' +
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
      event: { type: 'new' | 'edit', args }
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

```txt
!help
Syntax: !commandName [options] <optionalArgument> requiredArgument
  echo [options] phraseToEcho
    Echos the given phrase back to the user.
    --capitalize -c | Capitalizes the echoed text. (default: false)
    --debug         | Enables debug logging. (default: false)
  help
    Shows this page.
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
