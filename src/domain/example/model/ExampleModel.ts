import Model from '@core/domain/Model'

interface ExampleModelInterface {
  id: string
  description: string
}

export class ExampleModel extends Model implements ExampleModelInterface {
  id: string
  description: string
}
