import { Express, Router } from "express";

export default class HealthCheckController {
    public router: Router
    constructor() {
        this.router = Router();
        this.init()
    }

    init = () => {
        this.router.get("/", this.healthcheck);
    }

    healthcheck = (req, res, next) =>
        res.status(200).send();
}