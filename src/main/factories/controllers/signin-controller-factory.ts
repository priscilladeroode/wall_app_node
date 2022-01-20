import { SignInController } from '../../../presentation/controllers/users/signin-controller'
import { Controller } from '../../../presentation/protocols'
import { makeLogControllerDecorator } from '../decorators/log-controller-decorator-factory'
import { makeSignInValidation } from '../validations/signin-validation-factory'

export const makeSignInController = (): Controller => {
  const usecase = new DBAddAccount(encrypter, repository)
  const validation = makeSignInValidation()
  const controller = new SignInController(validation, usecase)
  return makeLogControllerDecorator(controller)
}
