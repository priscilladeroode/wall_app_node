import { ServerError, UnauthorizedError } from '../errors'
import { CustomError } from '../protocols/custom_error'
import { HttpResponse } from '../protocols/http'

export const badRequest = (error: CustomError): HttpResponse => ({
  statusCode: 400,
  body: {
    errorCode: error.errorCode,
    message: error.message
  }
})

export const unauthorized = (): HttpResponse => {
  const unauthorized = new UnauthorizedError()
  return {
    statusCode: 401,
    body: {
      errorCode: unauthorized.errorCode,
      message: unauthorized.message
    }
  }
}

export const notFound = (error: CustomError): HttpResponse => ({
  statusCode: 404,
  body: {
    errorCode: error.errorCode,
    message: error.message
  }
})

export const forbidden = (error: CustomError): HttpResponse => ({
  statusCode: 403,
  body: {
    errorCode: error.errorCode,
    message: error.message
  }
})

export const serverError = (error: CustomError): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const created = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data
})
