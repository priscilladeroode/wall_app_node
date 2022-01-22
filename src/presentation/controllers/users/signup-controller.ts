import { AddAccount } from '../../../domain/usecases/users'
import { AuthenticationUseCase } from '../../../domain/usecases/users/authentication-usecase'
import { badRequest, serverError, ok } from '../../helpers/http'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { Validation } from '../../protocols/validation'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
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

      const { name, password, email } = data

      await this.addAccount.add({
        name,
        email,
        password
      })
      const account = await this.authenticationUseCase.auth({ email, password })
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
