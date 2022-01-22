import {
  LoadAccountByTokenRequestEntity,
  LoadAccountByTokenResponseEntity
} from '../../../domain/entities/users'
import { LoadAccountByTokenUseCase } from '../../../domain/usecases/users/load-account-by-token-usecase'
import { Decrypter } from '../../protocols/cryptography/decrypter'

export class DbLoadAccountByToken implements LoadAccountByTokenUseCase {
  constructor (private readonly decrypter: Decrypter) {}

  async loadByToken (
    entity: LoadAccountByTokenRequestEntity
  ): Promise<LoadAccountByTokenResponseEntity> {
    await this.decrypter.decrypt(entity.accessToken)
    return null
  }
}
