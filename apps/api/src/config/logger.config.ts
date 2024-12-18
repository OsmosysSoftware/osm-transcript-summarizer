import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { transports, format } from 'winston';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import 'winston-daily-rotate-file';

const logDir = 'logs';
const logFormat = format.combine(
  format.timestamp(),
  format.printf((info) => {
    const { timestamp, level, url, httpMethod, context, data, message, stack } = info;
    const severity =
      level === 'error' || level === 'fatal' ? 'high' : level === 'warn' ? 'med' : 'low';
    // TODO: Update tracebackId so that it remains same for all the logs related to one API request
    // The logs in the assistant component for that request should also have the same tracebackId
    const tracebackId = uuidv4();
    const logObject = {
      timestamp,
      level,
      severity,
      tracebackId,
      url,
      httpMethod,
      source: context,
      data,
      message,
      stackTrace: stack,
    };
    return JSON.stringify(logObject);
  }),
);

const transportsConfig = [
  new transports.Console({
    format: format.combine(
      format.timestamp(),
      format.ms(),
      nestWinstonModuleUtilities.format.nestLike('TranscriptSummarizer'),
    ),
  }),

  new transports.DailyRotateFile({
    filename: join(logDir, 'combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxFiles: '30d',
    maxSize: '5m',
    format: logFormat,
  }),
  new transports.DailyRotateFile({
    filename: join(logDir, 'error-%DATE%.log'),
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxFiles: '30d',
    maxSize: '5m',
    format: logFormat,
  }),
];

export const loggerConfig = WinstonModule.createLogger({
  transports: transportsConfig,
});
