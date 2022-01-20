import { DBAddAccount } from '../../../data/usecases/users/db-add-account'
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter'
import { UserMongoRepository } from '../../../infra/db/mongodb/user-mongo-repository'
import { SignUpController } from '../../../presentation/controllers/users/signup-controller'
import { Controller } from '../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../validations/validators/email-validator'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const adapter = new EmailValidatorAdapter()
  const encrypter = new BcryptAdapter(salt)
  const repository = new UserMongoRepository()
  const usecase = new DBAddAccount(encrypter, repository)
  const controller = new SignUpController(adapter, usecase)
  return new LogControllerDecorator(controller)
}
