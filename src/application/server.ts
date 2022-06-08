
import express from 'express'
import { Server as HttpServer } from 'node:http'
import swaggerUi from 'swagger-ui-express'
import 'dotenv/config'
import swaggerAutogen from 'swagger-autogen'
import { container } from 'tsyringe'

import HealthCheckController from './controllers/HealthcheckController'
import * as swaggerDoc from '../../swagger.json'
import Logger from '@infra/Logger/Logger'
import ExitStatus from '@shared/enum/ExitStatus'
import HttpLogger from '@infra/HttpLogger/HttpLogger'
import express from "express";
import HealthCheckController from "./controllers/HealthcheckController";
import swaggerAutogen from "swagger-autogen";
import swaggerUi from "swagger-ui-express";
import "dotenv/config";
import winston from "winston";
import morgan from "morgan";
import * as swaggerDoc from "../../swagger.json"
import ExampleController from "./controllers/ExampleController";

export default class Server {
    public app: express.Application;
    public static logger: winston.Logger;
    constructor() {
        this.app = express();
        this.setupApplicationLogger();
        this.setupErrorHandlerLogger();
        this.setupRoutes();
    }

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
    this.app.use(HttpLogger)
  }

  private readonly setupErrorHandlerLogger = (): void => {
    this.app.use(this.logErrors)
    this.app.use(this.errorHandler)
  }

    setupApplicationLogger = () => {
        Server.logger = winston.createLogger({
            transports: [
                new winston.transports.Console({
                    level: 'debug',
                    handleExceptions: true,
                    format: winston.format.combine(
                        winston.format.timestamp({ format: 'HH:mm:ss:ms' }),
                        winston.format.colorize(),
                        winston.format.prettyPrint(),
                        winston.format.printf(
                            (info) => `${info.timestamp} ${info.level}: ${JSON.stringify(info.message, null, 4)}`,
                        ),
                        //  winston.format.simple(),
                    ),
                }),
            ],
            exitOnError: false

        });

        if (process.env.NODE_ENV === "dev") {
            Server.logger.add(
                new winston.transports.File({
                    level: 'info',
                    filename: './logs/all-logs.log',
                    handleExceptions: true,
                    format: winston.format.combine(
                        winston.format.timestamp({
                            format: 'YYYY-MM-DD HH:mm:ss',
                        }),
                        winston.format.errors({ stack: true }),
                        winston.format.printf(
                            (info) => `${info.timestamp} ${info.level}: ${info.message}`,
                        ),
                        // winston.format.splat(),
                        // winston.format.json()
                    ),
                    maxsize: 5242880, //5MB
                    maxFiles: 5,
                }));
        }
        Server.logger.info("logging started");

        this.app.use(morgan(function (tokens, req, res) {
            const msg = [
                tokens.method(req, res),
                tokens.url(req, res),
                tokens.status(req, res),
                tokens.res(req, res, 'content-length'), '-',
                tokens['response-time'](req, res), 'ms',
            ].join(' ');
            Server.logger.http(msg);
            return null;
            // return msg;
        })
        );
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

    setupRoutes = () => {
        this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc))
        this.app.use("/api/v1/healthcheck", new HealthCheckController().router)
        this.app.use("/api/v1/examples", new ExampleController().router)

    }
    res.status(500)
    res.render('error', { error: err })
  }

  private readonly logErrors = (err, req, res, next): void => {
    console.error(err.stack)
    next(err)
  }


  static bootstrap = (): Server => new Server()

    logErrors = (err, req, res, next) => {
        Server.logger.error(err.stack)
        next(err)
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
