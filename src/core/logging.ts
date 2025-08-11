import winston from 'winston';
import config from 'config';
import { env } from 'node:process';

const LOG_LEVEL = config.get<string>('log.level');
const LOG_DISABLED = config.get<boolean>('log.disabled');
const NODE_ENV = env['NODE_ENV'];

console.log(`node env: ${NODE_ENV}, log level ${LOG_LEVEL}, logs enabled: ${Boolean(LOG_DISABLED)}`);

const rootLogger: winston.Logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.simple(),
  transports: [new winston.transports.Console({
    silent: LOG_DISABLED,
  })],
});

export const getLogger = () => {
  return rootLogger;
};
