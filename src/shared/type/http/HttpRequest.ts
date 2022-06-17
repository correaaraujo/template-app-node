import { Request } from 'express'

export type HttpRequest = Partial<Request> & {
  body: any
}
