# discordjs-commander

A command manager for discord.js bots.

```ts
import { Client } from 'discord.js';
import { Command, Commander, Event, parse, subscribe } from 'discordjs-commander';

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

1. Install library: [`npm i discordjs-commander`](#).
2. Enable `experimentalDecorators` and `emitDecoratorMetadata` in `tsconfig.json`.
3. Try the example above.

_Note: If you are using vscode you might need to set `javascript.implicitProjectConfig.experimentalDecorators` to `true` in the workspace settings._

## Development

1. Grab your discord-bot secret from the [discord developer portal](https://discordapp.com/developers/applications).
2. Create a `secrets.json` file and store your discord-bot secret as `discord_token` inside it.
3. Install dependencies: `npm i`.
4. Start demo: `npm run demo:start`.

## Dev Resources 
* [Typescript workaround for `@options` & `@options(string)`.](https://www.typescriptlang.org/play/?noImplicitAny=false&experimentalDecorators=true&emitDecoratorMetadata=true#code/GYVwdgxgLglg9mABHADrBAKKBDATgcwFMoAuRbMATwBpEBrQysgZylxjHwEoBuAWABQoSOiSpRGYABts+Fmw7cyWPEVLkqtBk1btOXRAF4AfBsr8h4aPDFobGAHRPVzLmQqVEAb0GI-iGGBEDBcHKUJOKAALI0NDRABGAx8BfzTECARWRABtaVkAQSkYbGYAXSNyAmYLdP9cYhBcJAB9FvF7fPwiktda-wBfX39MsGycnAJiLUZabGLSiviXfr82jsx53q4VKagZyl5BIYFR7PW7BEqQheZ5PW4jU121d016RnvFAxNvYb8znBwmE4PgXtMPjRyLcjgIToIIDJmMxEAAxOBwP6pfwAAQ2SBQ7AAbtgoIREAAjSpsECEVaIPGXMAYADk2BZBkJMBJZPIlWA82YdOOQA)
