import { DMChannel, GroupDMChannel, Message, TextChannel, User } from 'discord.js';
import { EventType } from './interfaces/metadata';
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
}
