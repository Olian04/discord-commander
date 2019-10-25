interface IMessageHandlerResponse {
  /**
   * Indicates if commander attempted to delete the message.
   *
   * @type {boolean}
   * @memberof IMessageHandlerResponse
   */
  deleted: boolean;
}

export interface IMessageHandlerResponseOK extends IMessageHandlerResponse {
  status: 'ok';
  command: string;
}
export interface IMessageHandlerResponseSKIP extends IMessageHandlerResponse {
  status: 'skip';

  /**
   * Human readable string, describing the reason as to why the message was skipped.
   *
   * @type {string}
   * @memberof IMessageHandlerResponseSKIP
   */
  reason: string;
}

export type MessageHandlerResponse =
  IMessageHandlerResponseOK | IMessageHandlerResponseSKIP;
