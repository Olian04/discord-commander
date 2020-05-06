import { DMChannel, NewsChannel, Message, TextChannel, User } from 'discord.js';
import { EventType } from './interfaces/metadata';
import { debugPrintObject } from './util/debugPrintObject';
import { logger } from './util/logging';
import { Record } from '@olian/typescript-helpers';

export class Event extends Record<Event> {
  public command: string;
  public event: {
    type: EventType;
    time: Date;
  };
  public author: User;
  public channel: TextChannel | DMChannel | NewsChannel;
  public message: Message;

  constructor(e: Event) {
    super(e);
    logger.debug(debugPrintObject('Event', e));
  }
}
