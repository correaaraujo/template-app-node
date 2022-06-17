type ApiError = {
  status: number
  title: string
  detail: string
  field?: string
  error_code?: string
}

export default ApiError
