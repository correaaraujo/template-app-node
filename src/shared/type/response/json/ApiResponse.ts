import Hyperlink from '@shared/type/Hyperlink'

export type ApiRetrieve<T> = Partial<T> & {
  _links?: Hyperlink
}

export type ApiResponseArray<T> = {
  data: Array<Partial<T>>
  _links?: Hyperlink
}
