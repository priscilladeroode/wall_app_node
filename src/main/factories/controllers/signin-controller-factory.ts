import { SignInController } from '../../../presentation/controllers/users/signin-controller'
import { Controller } from '../../../presentation/protocols'
import { makeLogControllerDecorator } from '../decorators/log-controller-decorator-factory'
import { makeAuthenticationUseCase } from '../usecases/authentication-usecase-factory'
import { makeSignInValidation } from '../validations/signin-validation-factory'

export const makeSignInController = (): Controller => {
  const authenticationUseCase = makeAuthenticationUseCase()
  const validation = makeSignInValidation()
  const controller = new SignInController(validation, authenticationUseCase)
  return makeLogControllerDecorator(controller)
}
