import { DbLoadAccountByToken } from '../../../../data/usecases/users/db-load-account-by-token'
import { LoadAccountByTokenUseCase } from '../../../../domain/usecases/users/load-account-by-token-usecase'
import { JwtAdapter } from '../../../../infra/cryptography/jwt-adapter'
import { UserMongoRepository } from '../../../../infra/db/mongodb/user-mongo-repository'
import env from '../../../config/env'

export const makeLoadAccountByTokenUseCase = (): LoadAccountByTokenUseCase => {
  const repository = new UserMongoRepository()
  const decrypter = new JwtAdapter(env.jwtSecret)
  return new DbLoadAccountByToken(decrypter, repository)
}
