import { createLogger, format, transports } from 'winston';
import path from 'path';

const customFormat = format.printf(({ level, message, timestamp, stack }) => {
  let fileName = 'unknown';

  if (typeof stack === 'string') {
    const stackLines = stack.split('\n');
    if (stackLines.length > 1) {
      const filePath = stackLines[1].trim().split(' ')[1];
      fileName = filePath ? path.basename(filePath) : 'unknown';
    }
  }

  return `${timestamp} [${level}]: [${fileName}] ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.colorize(), // Enables colored logs
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Adds timestamp
    format.errors({ stack: true }), // Captures error stack traces
    customFormat // Custom format with file name
  ),
  transports: [new transports.Console()], // Only log to the console
});

export default logger;
