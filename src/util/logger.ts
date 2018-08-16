import * as path from 'path';
import * as util from 'util';
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, label, printf, colorize } = format;
let customLogger: {};

const getLabel = (callingModule: any) => {
  const parts = callingModule.filename.split(path.sep);
  return parts[parts.length - 2] + path.sep + parts.pop();
};

const logFormat = printf((info) => {
  return `${info.timestamp} [${info.level}]: ${info.message} - ${info.label}`;
});

function formatArgs(args: string[]) {
  return [util.format.apply(util.format, Array.prototype.slice.call(args))];
}

const logger = (moduleName: string) => {
  if(!customLogger){
    const newLogger = createLogger({
      exitOnError: false,
      level: process.env.LOG_LEVEL || 'debug',
      transports: [
        new transports.Console({
          format: combine(
            timestamp(),
            colorize(),
            label({ label: getLabel(moduleName) }),
            logFormat,
          ),
          handleExceptions: true,
        }),
      ],
    });
    customLogger = {
      debug: (...args: string[]) => {
        newLogger.debug.apply(newLogger, formatArgs(args));
      },
      error: (...args: string[]) => {
        newLogger.error.apply(newLogger, formatArgs(args));
      },
      info: (...args: string[]) => {
        newLogger.info.apply(newLogger, formatArgs(args));
      },
      log: (...args: string[]) => {
        newLogger.info.apply(newLogger, formatArgs(args));
      },
      warn: (...args: string[]) => {
        newLogger.warn.apply(newLogger, formatArgs(args));
      },
    };
  }
  return customLogger;
};

module.exports = logger;