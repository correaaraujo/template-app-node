import { Server as HttpServer } from 'node:http'
import Server from '../application/server'
import Logger from './Logger/logger'

const port = process.env.PORT

void (async (): Promise<void> => {
  try {
    const server: HttpServer = Server.bootstrap().app.listen(port, () => {
      Logger.info(`Server Running on port ${port}!`)
    })
    Server.configureGracefulShutdown(server)
  } catch (error) {
    Logger.error('An unexpected error prevented the server from starting up.')
    Logger.error(String(error))
  }
})()
