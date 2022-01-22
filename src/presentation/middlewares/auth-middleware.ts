import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http'
import { HttpRequest, HttpResponse } from '../protocols'
import { Middleware } from '../protocols/middlewares'

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return forbidden(new AccessDeniedError())
  }
}
