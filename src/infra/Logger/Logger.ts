import { inject, singleton } from 'tsyringe'
import ILogger from './ILogger'

@singleton()
class Logger implements ILogger {
  /**
   *
   * @param _logger - Dependency Injection with default state
   */
  public constructor (
    @inject('Logger')
    private readonly _logger: ILogger
  ) {}

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

  /**
   *
   * @param message - The message string to be logged
   */
  http (message: string): void {
    this._logger.http(message)
  }
}

/**
 * [Singleton]
 */
export default Logger
