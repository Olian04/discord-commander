export type LogLevels =  'debug' | 'verbose' | 'info' | 'warning' | 'silent';
export type LogTypes = 'log' | 'info' | 'warn' | 'error' | 'debug';
/*
log: something happened, no action needed
info: life cycle event happened.
warn: something bad happened, action recommended
error: something really bad happened, action required
debug: something only usefully to the developer happened
*/

const logLevelMap: { [key in LogLevels]: LogTypes[] } = {
  debug: [ 'log', 'info', 'warn', 'error', 'debug' ],
  verbose: [ 'log', 'info', 'warn', 'error' ],
  info: [ 'info', 'warn', 'error' ],
  warning: [ 'warn', 'error' ],
  silent: [ 'error' ],
};

let currentLogLevel: LogLevels = 'info';

const events = {
  onLog: (type: LogTypes, ...msg: any[]) => { /* Fires on every call to __log, no matter the currentLogLevel */ },
  onLogEmitted: (type: LogTypes, ...msg: any[]) => {  /* Fires only if the log will be emitted to stdout */  },
};

const __log = (type: LogTypes) => (...msg: any[])  => {
  events.onLog(type, ...msg);
  if (logLevelMap[currentLogLevel].includes(type)) {
    events.onLogEmitted(type, ...msg);
    console[type]('Commander:', ...msg);
  }
};

class Logger {
  public log = __log('log');
  public info = __log('info');
  public warn = __log('warn');
  public error = __log('error');
  public debug = __log('debug');
  public set logLevel(newLogLevel: LogLevels) {
    currentLogLevel = newLogLevel;
  }
  public get logLevel() {
    return currentLogLevel;
  }
  public set onLog(cb: (type: LogTypes, ...msg: any[]) => void) {
    events.onLog = cb;
  }
  public set onLogEmitted(cb: (type: LogTypes, ...msg: any[]) => void) {
    events.onLogEmitted = cb;
  }
}

export const logger = new Logger();
