import { BaseRepository } from './base/BaseRepository'
import { ExampleModel } from '../../../../domain/example/model/ExampleModel'

export class ExampleRepository extends BaseRepository {
  public getAll = async (): Promise<ExampleModel[]> =>
    /* await this.repository.example.findMany(); */
    [
      { id: '10', description: 'exemplo 10' },
      { id: '11', description: 'exemplo 11' },
      { id: '20', description: 'exemplo 20' },
      { id: '30', description: 'exemplo 30' }
    ]
}
