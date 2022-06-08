import express from "express";
import HealthCheckController from "./controllers/HealthcheckController";
import swaggerAutogen from "swagger-autogen";
import swaggerUi from "swagger-ui-express";
import "dotenv/config";
import winston from "winston";
import morgan from "morgan";
import * as swaggerDoc from "../../swagger.json"
import ExampleController from "./controllers/ExampleController";
import { inject, injectable } from "tsyringe";
import Logger from "../infra/log/logger";

@injectable()
export default class Server {
    public app: express.Application;
    constructor(logger?: Logger) {
        this.app = express();
        this.setupApplicationLogger();
        this.setupErrorHandlerLogger();
        this.setupRoutes();
    }


    setupApplicationLogger = () => {
        this.app.use(morgan(function (tokens, req, res) {
            const msg = [
                tokens.method(req, res),
                tokens.url(req, res),
                tokens.status(req, res),
                tokens.res(req, res, 'content-length'), '-',
                tokens['response-time'](req, res), 'ms',
            ].join(' ');
            this.logger.http(msg);
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
        this.logger.error(err.stack)
        next(err)
    }

    static bootstrap = () => new Server();
}