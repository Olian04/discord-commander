import 'reflect-metadata';
import { IMetadata } from './interfaces/metadata.interface';

export const PROPERTY_METADATA_KEY = Symbol('propertyMetadata');

const initialMetadata = (): IMetadata => ({
  subscribers: {},
});

export const updateMetadata = (target, cb: (metadata: IMetadata) => IMetadata) => {
  // Pull the existing metadata or create an empty object
  let allMetadata: IMetadata = (
    Reflect.getMetadata(PROPERTY_METADATA_KEY, target)
    || initialMetadata()
  );

  allMetadata = cb(allMetadata);

  // Update the metadata
  Reflect.defineMetadata(
    PROPERTY_METADATA_KEY,
    allMetadata,
    target,
  );
};

export const getMetadata = (target): IMetadata => (
  Reflect.getMetadata(PROPERTY_METADATA_KEY, target)
  || initialMetadata()
);
