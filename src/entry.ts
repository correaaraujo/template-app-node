import 'reflect-metadata'
import DependencyInjection from '@core/infra/dependency-injection/DependencyInjection'

import { Server as HttpServer } from 'node:http'
import { container } from 'tsyringe'

import Server from '@application/server'
import { Logger } from '@infra/logger'

const port = process.env.PORT
const logger = container.resolve(Logger)

void (async (): Promise<void> => {
  try {
    // Initialize services that need a manually startup
    DependencyInjection.setup()

    // Initialize the server instance
    const server: HttpServer = Server
      .bootstrap().app
      .listen(port, () => {
        logger.info(`Server running on port ${port}!`)
      })

    // Initialize Node.js graceful shut down
    Server.setupGracefulShutdown(server)
  } catch (error) {
    logger.error('An unexpected error prevented the server from starting up.')
    logger.error(String(error))
  }
})()
