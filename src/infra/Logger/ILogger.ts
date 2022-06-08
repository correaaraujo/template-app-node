/**
 * Ensuring that the logger class has these methods
 */
export default interface ILogger {
  debug: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
  warn: (message: string) => void
  http: (message: string) => void
}
