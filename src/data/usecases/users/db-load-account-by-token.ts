import {
  LoadAccountByTokenRequestEntity,
  LoadAccountByTokenResponseEntity
} from '../../../domain/entities/users'
import { LoadAccountByTokenUseCase } from '../../../domain/usecases/users/load-account-by-token-usecase'
import { Decrypter } from '../../protocols/cryptography/decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/db/users/load-account-by-token-repository'

export class DbLoadAccountByToken implements LoadAccountByTokenUseCase {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async loadByToken (
    entity: LoadAccountByTokenRequestEntity
  ): Promise<LoadAccountByTokenResponseEntity> {
    const token = await this.decrypter.decrypt(entity.accessToken)
    if (token) {
      const id = await this.loadAccountByTokenRepository.loadByToken({
        accessToken: entity.accessToken
      })
      if (id) {
        return id
      }
    }
    return null
  }
}
