import morgan from 'morgan'
import { container } from 'tsyringe'
import Logger from '../Logger/Logger'

const logger = container.resolve(Logger)

/**
 * HttpLogger with Morgan Lib implementation
 */
const HttpLogger =
  morgan(function (tokens, req, res) {
    const msg = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ')
    logger.http(msg)
    return null
  })

export default HttpLogger
