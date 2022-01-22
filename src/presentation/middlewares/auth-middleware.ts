import { LoadAccountByTokenUseCase } from '../../domain/usecases/users/load-account-by-token-usecase'
import { AccessDeniedError } from '../errors'
import { forbidden, ok, serverError } from '../helpers/http'
import { HttpRequest, HttpResponse } from '../protocols'
import { Middleware } from '../protocols/middlewares'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByTokenUseCase: LoadAccountByTokenUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (accessToken) {
        const uid = await this.loadAccountByTokenUseCase.loadByToken({
          accessToken
        })
        if (uid) {
          return ok(uid)
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}
