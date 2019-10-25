import { ICommandInstance } from '../command';
import { Event } from '../event';
import { EventType } from '../interfaces/metadata';
import { debugPrintObject } from '../util/debugPrintObject';
import { logger } from '../util/logging';
import { metadata } from '../util/metadata';

export const subscribe = <Target extends ICommandInstance>(...events: EventType[]) =>
  <T extends (event: Event) => void>(
    target: Target, propertyKey: string, propertyDescriptor: TypedPropertyDescriptor<T>,
  ): TypedPropertyDescriptor<T> => {
    if (typeof propertyKey !== 'string') {
      logger.error(
        new Error(`Event subscribers can only be defined by string keys. Error occurred in command "${metadata.get(target, 'name')}"`),
      );
    }

    logger.debug(debugPrintObject('Subscribe', {
      commandName: metadata.get(target, 'name'),
      events: `[${events.join(', ')}]`,
      propertyKey,
    }));
    
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
