import { AuthenticationUseCase } from '../../../domain/usecases/users/authentication-usecase'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { Validation } from '../../protocols/validation'

export class SignInController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly authenticationUseCase: AuthenticationUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const data = Object.assign({}, httpRequest.body, {
        email: httpRequest.body.email.toLowerCase()
      })

      const { password, email } = data

      const accessToken = await this.authenticationUseCase.auth({
        email,
        password
      })

      if (!accessToken) {
        return unauthorized()
      }
      return ok(accessToken)
    } catch (error) {
      return serverError(error)
    }
  }
}
