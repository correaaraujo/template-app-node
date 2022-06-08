import morgan from 'morgan'
import { container } from 'tsyringe'
import Logger from '../Logger/Logger'

const logger = container.resolve(Logger)

/**
 *
 * @returns
 */
const HttpLogger = (): unknown =>
  morgan(function (tokens, req, res) {
    const msg = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ')
    logger.http(msg)
    console.log(msg)
    return null
  })

export default HttpLogger
