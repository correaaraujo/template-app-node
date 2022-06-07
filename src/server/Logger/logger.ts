import ILogger from './protocols'
import WinstonLogger from './winston/winston'
const DEFAULT_LOGGER_IMPLEMENTATION: ILogger = new WinstonLogger()

class Logger implements ILogger {
  public constructor (private readonly _logger: ILogger = DEFAULT_LOGGER_IMPLEMENTATION) {}

  /**
   *
   * @param message - The message string to be logged
   */
  debug (message: string): void {
    this._logger.debug(message)
  }

  /**
   *
   * @param message - The message string to be logged
   */
  error (message: string): void {
    this._logger.error(message)
  }

  /**
   *
   * @param message - The message string to be logged
   */
  info (message: string): void {
    this._logger.info(message)
  }

  /**
   *
   * @param message - The message string to be logged
   */
  warn (message: string): void {
    this._logger.warn(message)
  }
}

/**
 * [Singleton]
 */
export default new Logger()
