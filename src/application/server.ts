
import express from 'express'
import 'dotenv/config'
import { Server as HttpServer } from 'node:http'
import swaggerUi from 'swagger-ui-express'
import { container } from 'tsyringe'
import * as swaggerDoc from '../../swagger.json'
import Logger from '@infra/Logger/Logger'
import ExitStatus from '@shared/enum/ExitStatus'
import HttpLogger from '@infra/HttpLogger/HttpLogger'
import HealthCheckController from './controllers/HealthcheckController'
import ExampleController from './controllers/ExampleController'
const logger = container.resolve(Logger)

export default class Server {
  app: express.Application

  constructor () {
    this.app = express()
    this.setupHttpLogger()
    this.setupRoutes()
    this.setupUnhandledOperations()
  }

  private readonly setupHttpLogger = (): void => {
    this.app.use(HttpLogger)
  }

  private readonly setupRoutes = (): void => {
    this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))
    this.app.use('/api/v1/healthcheck', new HealthCheckController().router)
    this.app.use('/api/v1/examples', new ExampleController().router)
  }

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
        // logger.info(`Closing server connections due an ${signal} command...`)
        // TODO: Close DB and other connections
        server.close((serverError) => {
          if (serverError) {
            // logger.error('An unexpected error ocurred while trying to shut down...')
            // logger.error(String(serverError))
            process.exit(ExitStatus.FAILURE)
          } else {
            // logger.info('Server connections closed successfully!!!')
            process.exit(ExitStatus.SUCCESS)
          }
        })
      })
    })
  }

  static bootstrap = (): Server => new Server()
}
