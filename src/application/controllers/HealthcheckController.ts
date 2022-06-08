import { Router } from 'express'

export default class HealthCheckController {
  public router: Router
  constructor () {
    this.router = Router()
    this.init()
  }

  init = (): void => {
    this.router.get('/', this.healthcheck)
  }

  healthcheck = (req, res, next): void =>
    res.status(200).send()
}
