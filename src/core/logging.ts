import winston from 'winston';
import config from 'config';
import path from 'path';
import fs from 'fs';

const LOG_LEVEL = config.get<string>('log.level');
const LOG_DISABLED = config.get<boolean>('log.disabled');
const NODE_ENV = config.get<string>('env');
const { errors, combine, timestamp, colorize, printf } = winston.format;

const loggerFormat = () => {
  const formatMessage = ({
    level,
    message,
    timestamp,
    ...rest
  }: winston.Logform.TransformableInfo) => {
    const cleanRest = Object.fromEntries(
      Object.entries(rest).filter(([key]) => !['level', 'timestamp', 'message'].includes(key)),
    );

    //const isDev = NODE_ENV === 'development';

    const meta = Object.keys(cleanRest).length > 0
      ? ` | ${JSON.stringify(cleanRest, null, 0)}`
      : '';

    return `${timestamp} | ${level} | ${message}${meta}`;
  };

  const formatError = (info: winston.Logform.TransformableInfo) => {
    const { error, ...rest } = info;
    const stack = error instanceof Error ? error.stack : 'No stack trace';
    return `${formatMessage(rest)}\n\n${stack}\n`;
  };

  const format = (info: winston.Logform.TransformableInfo) => {
    const cloned = { ...info };

    if (cloned.message instanceof Error) {
      cloned.error = cloned.message;
      cloned.message = cloned.message.message;
    }

    if ('error' in info && info.error instanceof Error) {
      return formatError(cloned);
    }

    return formatMessage(cloned);
  };

  return (NODE_ENV === 'testing')
    ?
    combine(errors({ stack: true }),timestamp(), printf(format))
    :
    combine(errors({ stack: true }), colorize(), timestamp(), printf(format));
};

if (NODE_ENV === 'testing') {
  const logDir = path.join(process.cwd(), 'logging');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
}

const rootLogger: winston.Logger = winston.createLogger({
  level: LOG_LEVEL,
  format: loggerFormat(),
  defaultMeta: { env: NODE_ENV },
  transports:
    NODE_ENV === 'testing'
      ? [
        new winston.transports.File({
          filename: path.join(process.cwd(), 'logging', 'testing.log'),
          silent: LOG_DISABLED,
        }),
      ]
      : [new winston.transports.Console({ silent: LOG_DISABLED })],
});

// Log startup message if logging is enabled
if (!LOG_DISABLED) {
  rootLogger.info('Logger initialized', { level: LOG_LEVEL, env: NODE_ENV, silent: LOG_DISABLED });
} else {
  console.log('Logger disabled', { level: LOG_LEVEL, env: NODE_ENV, silent: LOG_DISABLED });
}

export const getLogger = (): winston.Logger => rootLogger;
