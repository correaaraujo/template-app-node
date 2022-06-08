import 'reflect-metadata'
import './shared/container'
import { Server as HttpServer } from 'node:http'
import { container } from 'tsyringe'

import Server from '@application/server'
import Logger from '@infra/Logger'

const port = process.env.PORT
const logger = container.resolve(Logger)

void (async (): Promise<void> => {
  try {
    const server: HttpServer = Server.bootstrap().app.listen(port, () => {
      logger.info(`Server running on port ${port}!`)
    })
    Server.setupGracefulShutdown(server)
  } catch (error) {
    logger.error('An unexpected error prevented the server from starting up.')
    logger.error(String(error))
  }
})()
