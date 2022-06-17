import crypto from 'node:crypto'

abstract class Model {
  protected readonly id: string

  constructor (id?: string) {
    this.id = id || crypto.randomUUID()
  }
}

export default Model
