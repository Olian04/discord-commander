import { MetadataHandler } from 'ts-metadata-handler';
import { IMetadata } from '../interfaces/metadata';

export const metadata = new MetadataHandler<IMetadata>(() => ({
  argumentParsers: [],
  subscribers: {
    new: [],
    edit: [],
  },
  name: 'Should never be empty',
}));
