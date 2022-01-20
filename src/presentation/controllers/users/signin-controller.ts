import { AuthenticationUseCase } from '../../../domain/usecases/users/authentication-usecase'
import { EmailValidator } from '../../../validations/protocols/email-validator'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class SignInController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authenticationUseCase: AuthenticationUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const data = Object.assign({}, httpRequest.body, {
        email: httpRequest.body.email.toLowerCase()
      })

      const { password, email } = data

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const jwt = await this.authenticationUseCase.auth({
        email,
        password
      })

      if (!jwt) {
        return unauthorized()
      }
      return ok(jwt)
    } catch (error) {
      return serverError(error)
    }
  }
}
