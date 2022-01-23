import { DBAuthentication } from '@/data/usecases/users/db-authentication'
import { AuthenticationUseCase } from '@/domain/usecases/users/authentication-usecase'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter'
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter'
import { UserMongoRepository } from '@/infra/db/mongodb/user-mongo-repository'
import env from '../../../config/env'

export const makeAuthenticationUseCase = (): AuthenticationUseCase => {
  const repository = new UserMongoRepository()
  const salt = 12
  const hashComparer = new BcryptAdapter(salt)
  const encrypter = new JwtAdapter(env.jwtSecret)
  return new DBAuthentication(repository, hashComparer, encrypter, repository)
}
