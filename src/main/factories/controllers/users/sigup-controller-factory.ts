import { SignUpController } from '@/presentation/controllers/users/signup-controller'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeAddAccountUseCase } from '../../usecases/users/add-account-usecase-factory'
import { makeAuthenticationUseCase } from '../../usecases/users/authentication-usecase-factory'
import { makeSignUpValidation } from '../../validations/users/signup-validation-factory'

export const makeSignUpController = (): Controller => {
  const usecase = makeAddAccountUseCase()
  const validation = makeSignUpValidation()
  const authenticationUseCase = makeAuthenticationUseCase()
  const controller = new SignUpController(
    usecase,
    validation,
    authenticationUseCase
  )
  return makeLogControllerDecorator(controller)
}
