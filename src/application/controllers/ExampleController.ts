import { Express, Router } from "express";
import ExampleService from "../../domain/services/ExampleService";

export default class ExampleController {
    public router: Router
    service: ExampleService

    constructor() {
        this.router = Router();
        this.service = new ExampleService();
        this.init()
    }

    init = () => {
        this.router.get("/", this.getAll);
    }

    getAll = async (req, res, next) =>
        await this.service.getAll()
            .then(data => {
                res.status(200).send(data);
            }).catch(ex => {
                res.status(400)
                    .send("Ocorreu um erro")
            })
}