export interface IMetadata {
  subscribers: {
    [eventName: string]: string[];
  };
}
