import express from 'express'
import { Server as HttpServer } from 'node:http'
import swaggerUi from 'swagger-ui-express'
import 'dotenv/config'
import swaggerAutogen from 'swagger-autogen'
import { container } from 'tsyringe'
import morgan from 'morgan'

import HealthCheckController from './controllers/HealthcheckController'
import * as swaggerDoc from '../../swagger.json'
import Logger from '@infra/Logger/Logger'
import ExitStatus from '@shared/enum/ExitStatus'

const logger = container.resolve(Logger)

export default class Server {
  public app: express.Application
  constructor () {
    this.app = express()
    this.setupSwagger()
    this.setupHttpLogger()
    this.setupErrorHandlerLogger()
    this.setupRoutes()
    this.setupUnhandledOperations()
  }

  private readonly setupHttpLogger = (): void => {
    this.app.use(
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
    )
  }

  private readonly setupErrorHandlerLogger = (): void => {
    this.app.use(this.logErrors)
    this.app.use(this.errorHandler)
  }

  private readonly setupRoutes = (): void => {
    this.app.use('/api/v1/healthcheck', new HealthCheckController().router)
  }

  private readonly setupSwagger = (): void => {
    const doc = {
      info: {
        title: 'Exemplo de App',
        description: 'Description'
      },
      host: `localhost:${process.env.PORT}`,
      schemes: ['http']
    }

    const outputFile = '../../swagger.json'
    const endpointsFiles = [
      'src/application/controllers/HealthcheckController.ts',
      'src/application/server.ts'
    ]

    swaggerAutogen()(outputFile, endpointsFiles, doc)

    this.app.use(
      '/docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDoc)
    )
  }

  private readonly errorHandler = (err, req, res, next): void => {
    if (res.headersSent) {
      return next(err)
    }
    res.status(500)
    res.render('error', { error: err })
  }

  private readonly logErrors = (err, req, res, next): void => {
    console.error(err.stack)
    next(err)
  }

  static bootstrap = (): Server => new Server()

  /**
   * Handles unhandledRejection and uncaughtException events.
   */
  private readonly setupUnhandledOperations = (): void => {
    process.on('unhandledRejection', (reason, promise) => {
      logger.error(`App exiting due to an unhandled promise: ${String(promise)} and reason ${String(reason)}`)
      throw reason
    })
    process.on('uncaughtException', (error) => {
      logger.error(`App exiting due to an uncaught error: ${String(error)}`)
      process.exit(ExitStatus.FAILURE)
    })
  }

  /**
   * Configures a gracefull shutdown whenever the server crash
   * @param server - The server instance.
   */
  static readonly setupGracefulShutdown = (server: HttpServer): void => {
    const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT']
    exitSignals.forEach((signal: string) => {
      process.on(signal, () => {
        logger.info(`Closing server connections due an ${signal} command...`)
        // TODO: Close DB and other connections
        server.close((serverError) => {
          if (serverError) {
            logger.error('An unexpected error ocurred while trying to shut down...')
            logger.error(String(serverError))
            process.exit(ExitStatus.FAILURE)
          } else {
            logger.info('Server connections closed successfully!!!')
            process.exit(ExitStatus.SUCCESS)
          }
        })
      })
    })
  }
}
