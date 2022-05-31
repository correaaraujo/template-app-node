import express from "express";
import HealthCheckController from "./controllers/HealthcheckController";
import swaggerAutogen from "swagger-autogen";
import swaggerUi from "swagger-ui-express";
import "dotenv/config";
import * as swaggerDoc from "../../swagger.json";
import winston from "winston";
import morgan from "morgan";

export default class Server {
    public app: express.Application;
    constructor() {
        this.app = express();
        this.setupSwagger();
        this.setupApplicationLogger();
        this.setupErrorHandlerLogger();
        this.setupRoutes()
    }


    setupApplicationLogger = () => {
        const logger = winston.createLogger({
            transports: [
                new winston.transports.Console({
                    level: 'debug',
                    handleExceptions: true,
                    format: winston.format.combine(
                        winston.format.timestamp({ format: 'HH:mm:ss:ms' }),
                        winston.format.colorize(),
                        winston.format.printf(
                            (info) => `${info.timestamp} ${info.level}: ${info.message}`,
                        ),
                        //  winston.format.simple(),
                    ),
                }),
            ],
            exitOnError: false,
        });

        if (process.env.NODE_ENV === "dev") {
            logger.add(
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
        logger.info("logging started");

        this.app.use(morgan(function (tokens, req, res) {
            const msg = [
                tokens.method(req, res),
                tokens.url(req, res),
                tokens.status(req, res),
                tokens.res(req, res, 'content-length'), '-',
                tokens['response-time'](req, res), 'ms',
            ].join(' ');
            logger.http(msg);
            return null;
            // return msg;
        })
        );
    }

    setupErrorHandlerLogger = () => {
        this.app.use(this.logErrors)
        this.app.use(this.errorHandler)
    }

    setupRoutes = () => {
        this.app.use("/api/v1/healthcheck", new HealthCheckController().router)
    }

    setupSwagger = () => {
        let doc = {
            info: {
                title: 'Exemplo de App',
                description: 'Description',
            },
            host: `localhost:${process.env.PORT}`,
            schemes: ['http'],
        };

        let outputFile = '../../swagger.json';
        let endpointsFiles = ["src/application/controllers/HealthcheckController.ts", "src/application/server.ts"];

        swaggerAutogen()(outputFile, endpointsFiles, doc);

        this.app.use(
            "/docs",
            swaggerUi.serve,
            swaggerUi.setup(swaggerDoc)
        );
    }

    errorHandler = (err, req, res, next) => {
        if (res.headersSent) {
            return next(err)
        }
        res.status(500)
        res.render('error', { error: err })
    }

    logErrors = (err, req, res, next) => {
        console.error(err.stack)
        next(err)
    }

    static bootstrap = () => new Server();
}