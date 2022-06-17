import { ExampleRepository } from '../../../infra/database/prisma/repository/ExampleRepository'
import { ExampleModel } from '../model/ExampleModel'

export default class ExampleService {
  repository: ExampleRepository

  constructor () {
    this.repository = new ExampleRepository()
  }

  getAll = async (): Promise<ExampleModel[]> => await this.repository.getAll()
}
