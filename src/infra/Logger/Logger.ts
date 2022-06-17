import winston from 'winston'
import ILogger from './ILogger'

export class Logger implements ILogger {
  private readonly logger: winston.Logger = winston.createLogger({
    transports: [
      new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        format: winston.format.combine(
          winston.format.timestamp({ format: 'HH:mm:ss:ms' }),
          winston.format.colorize(),
          winston.format.printf(
            (info: winston.Logform.TransformableInfo) =>
              `${String(info.timestamp)} ${info.level}: ${info.message}`
          )
          //  winston.format.simple(),
        )
      })
    ],
    exitOnError: false
  })

  constructor () {
    if (process.env.NODE_ENV === 'dev') {
      this.logger.add(
        new winston.transports.File({
          level: 'info',
          filename: './logs/all-logs.log',
          handleExceptions: true,
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss'
            }),
            winston.format.errors({ stack: true }),
            winston.format.printf(
              (info: winston.Logform.TransformableInfo) =>
                `${String(info.timestamp)} ${info.level}: ${info.message}`
            )
            // winston.format.splat(),
            // winston.format.json()
          ),
          maxsize: 5242880, // 5MB
          maxFiles: 5
        }))
    }
  }

  debug (message: string): void {
    this.logger.debug(message)
  }

  error (message: string): void {
    this.logger.error(message)
  }

  info (message: string): void {
    this.logger.info(message)
  }

  warn (message: string): void {
    this.logger.warn(message)
  }

  http (message: string): void {
    this.logger.http(message)
  }
}
