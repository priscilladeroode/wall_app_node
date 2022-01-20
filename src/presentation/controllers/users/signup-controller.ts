import { AddAccount } from '../../../domain/usecases/users'
import { EmailValidator } from '../../../validations/protocols/email-validator'
import { InvalidParamError } from '../../errors'
import { badRequest, serverError, ok } from '../../helpers/http'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { Validation } from '../../protocols/validation'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
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

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
