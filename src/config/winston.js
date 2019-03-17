const winston = require('winston');
const { format } = require('logform');
const { getNodeEnv, NODE_ENVIRONMENT } = require('../utils/utils.js');

const env = getNodeEnv();
const workDir = process.cwd();

const options = {
  file: {
    level: env === NODE_ENVIRONMENT.DEV ? 'debug' : 'info',
    filename: `${workDir}/logs/app.log`,
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    json: true,
    colorize: false,
    maxFiles: 5,
    format: format.combine(
      format.timestamp(),
      format.prettyPrint(),
    ),
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
    format: format.combine(
      // format.colorize(),
      format.timestamp(),
      format.printf((info) => {
        const level = `${info.level.padStart(15, ' ')}:`;
        return `${info.timestamp} ${level} ${info.message}`;
      }),
    ),
  },
};
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize({message: true}),
    winston.format.simple(),
  ),
  transports: [
    new winston.transports.Console(options.console),
    new winston.transports.File(options.file),
  ],
  exitOnError: false,
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: (message) => {
    logger.info(message);
  },
};

module.exports = logger;
