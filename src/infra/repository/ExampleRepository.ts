import { BaseRepository } from './base/BaseRepository'
import { ExampleModel } from '../../domain/model/ExampleModel'

export class ExampleRepository extends BaseRepository {
  public getAll = async (): Promise<ExampleModel[]> =>
    this.repository.example.findMany()
}
