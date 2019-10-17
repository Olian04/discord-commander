# discordjs-commander

A command manager for discord.js bots.

```ts
import { Client } from 'discord.js';
import { Command, Commander, Event, parse, subscribe } from 'discord-commander';

class TestCommand extends Command('test') {
  @parse.nextWord private subCommand: string;
  @parse.remainingWords private arguments: string[];

  @subscribe('new')
  public onMessage(ctx: Event) {
    ctx.message.reply(`${ctx.command} ${this.subCommand} [${this.arguments.join(', ')}]`);
  }
}

const commander = new Commander('!', [
  TestCommand,
]);

const client = new Client();
commander.start(client);
client.login(discord_secret);
```

![demo img](./assets/demo.png)

## Install

1. Install library: [`npm i discord-commander`](#).
2. Enable `experimentalDecorators` and `emitDecoratorMetadata` in `tsconfig.json`.
3. Try the example above.

_Note: If you are using vscode you might need to set `javascript.implicitProjectConfig.experimentalDecorators` to `true` in the workspace settings._

## Development

1. Grab your discord-bot secret from the [discord developer portal](https://discordapp.com/developers/applications).
2. Create a `secrets.json` file and store your discord-bot secret as `discord_token` inside it.
3. Install dependencies: `npm i`.
4. Start demo: `npm run demo:start`.
