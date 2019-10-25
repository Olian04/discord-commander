import { DMChannel, GroupDMChannel, Message, TextChannel, User } from 'discord.js';
import { EventType } from './interfaces/metadata';
import { debugPrintObject } from './util/debugPrintObject';
import { logger } from './util/logging';
import { Record } from './util/record';

export class Event extends Record<Event> {
  public command: string;
  public event: {
    type: EventType;
    time: Date;
  };
  public author: User;
  public channel: TextChannel | DMChannel | GroupDMChannel;
  public message: Message;

  constructor(e: Event) {
    super(e);
    logger.debug(debugPrintObject('Event', e));
  }
}
