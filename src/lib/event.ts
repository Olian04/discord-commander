import { Message, TextChannel, User } from "discord.js";
import { Record } from "./util/record";

export class Event extends Record<Event> {
  public command: string;
  public options: {
    [key: string]: string | boolean | number;
  };
  public event: {
    type: 'new' | 'edit' | 'delete';
    args: unknown[];
    time: Date;
  };
  public author: User;
  public channel: TextChannel;
  public message: Message;
}
