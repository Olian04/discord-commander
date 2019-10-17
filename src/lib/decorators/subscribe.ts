import { ICommandInstance } from '../command';
import { Event } from '../event';
import { metadata } from '../util/metadata';
import { EventType } from '../interfaces/metadata';

export const subscribe = <Target extends ICommandInstance>(...events: EventType[]) => 
  <T extends (event: Event) => void>(
    target: Target, propertyKey: string, propertyDescriptor: TypedPropertyDescriptor<T>,
  ): TypedPropertyDescriptor<T> => {
    if (typeof propertyKey !== 'string') {
      throw new Error(`Commander: Event subscribers can only be defined by string keys.`);
    }

    metadata.update(target, (allMetadata) => {
      events.forEach((eventName) => {
        if (! (eventName in allMetadata.subscribers)) {
          allMetadata.subscribers[eventName] = [];
        }
        allMetadata.subscribers[eventName].push(propertyKey);
      });

      return allMetadata;
    });

    return propertyDescriptor;
};
