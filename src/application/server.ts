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

    setupErrorHandlerLogger = () => {
        this.app.use(this.logErrors)
        this.app.use(this.errorHandler)
    }

    setupRoutes = () => {
        this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc))
        this.app.use("/api/v1/healthcheck", new HealthCheckController().router)
        this.app.use("/api/v1/examples", new ExampleController().router)
    }

    errorHandler = (err, req, res, next) => {
        if (res.headersSent) {
            return next(err)
        }
        res.status(500)
        res.render('error', { error: err })
    }

    logErrors = (err, req, res, next) => {
        Server.logger.error(err.stack)
        next(err)
    }

    static bootstrap = () => new Server();
}