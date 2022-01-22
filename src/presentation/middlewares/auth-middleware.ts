import { LoadAccountByTokenUseCase } from '../../domain/usecases/users/load-account-by-token-usecase'
import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http'
import { HttpRequest, HttpResponse } from '../protocols'
import { Middleware } from '../protocols/middlewares'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByTokenUseCase: LoadAccountByTokenUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    if (accessToken) {
      await this.loadAccountByTokenUseCase.loadByToken({ accessToken })
    }
    return forbidden(new AccessDeniedError())
  }
}
