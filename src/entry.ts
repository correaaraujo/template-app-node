import Server from '../src/application/server'
import { Server as HttpServer } from 'node:http'

const port = process.env.PORT
const server: HttpServer = Server.bootstrap().app.listen(port, () => {
  console.log(`Server Running on port ${port}!`)
})
Server.configureGracefulShutdown(server)
