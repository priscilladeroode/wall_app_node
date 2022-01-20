import { DBAddAccount } from '../../../data/usecases/users/db-add-account'
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter'
import { UserMongoRepository } from '../../../infra/db/mongodb/user-mongo-repository'
import { SignUpController } from '../../../presentation/controllers/users/signup-controller'
import { Controller } from '../../../presentation/protocols'
import { makeLogControllerDecorator } from '../decorators/log-controller-decorator-factory'
import { makeSignUpValidation } from '../validations/signup-validation-factory'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const encrypter = new BcryptAdapter(salt)
  const repository = new UserMongoRepository()
  const usecase = new DBAddAccount(encrypter, repository)
  const validation = makeSignUpValidation()
  const controller = new SignUpController(usecase, validation)
  return makeLogControllerDecorator(controller)
}
