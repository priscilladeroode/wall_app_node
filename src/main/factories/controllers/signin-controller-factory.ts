import { DBAuthentication } from '../../../data/usecases/users/db-authentication'
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter'
import { UserMongoRepository } from '../../../infra/db/mongodb/user-mongo-repository'
import { SignInController } from '../../../presentation/controllers/users/signin-controller'
import { Controller } from '../../../presentation/protocols'
import env from '../../config/env'
import { makeLogControllerDecorator } from '../decorators/log-controller-decorator-factory'
import { makeSignInValidation } from '../validations/signin-validation-factory'

export const makeSignInController = (): Controller => {
  const repository = new UserMongoRepository()
  const salt = 12
  const hashComparer = new BcryptAdapter(salt)
  const encrypter = new JwtAdapter(env.jwtSecret)
  const usecase = new DBAuthentication(
    repository,
    hashComparer,
    encrypter,
    repository
  )
  const validation = makeSignInValidation()
  const controller = new SignInController(validation, usecase)
  return makeLogControllerDecorator(controller)
}
