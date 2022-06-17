import { HttpRequest, HttpResponse } from '@shared/type/http'
import ApiError from '@shared/type/response/json/ApiError'
import { ApiResponseArray } from '@shared/type/response/json/ApiResponse'
import { NextFunction, Router } from 'express'
import { ExampleModel } from 'src/domain/example/model/ExampleModel'
import ExampleService from '../../domain/example/services/ExampleService'

export default class ExampleController {
  public router: Router
  service: ExampleService

  constructor () {
    this.router = Router()
    this.service = new ExampleService()
    this.init()
  }

  init = (): void => {
    this.router.get('/', this.getAll)
  }

  getAll = async (req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.getAll()
      const response: ApiResponseArray<ExampleModel> = {
        data
      }
      res.status(200).send(response)
    } catch (error) {
      const statusCode: number = 400
      const response: ApiError = {
        status: statusCode,
        title: error.name || 'Unexpected error',
        detail: error.message
      }
      res.status(statusCode)
        .send(response)
    }
  }
}
