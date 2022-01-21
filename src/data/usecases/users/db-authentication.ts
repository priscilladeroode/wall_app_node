import {
  AuthenticationRequestEntity,
  AuthenticationResponseEntity
} from '../../../domain/entities/users'
import { AuthenticationUseCase } from '../../../domain/usecases/users/authentication-usecase'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { Encrypter } from '../../protocols/cryptography/encrypter'
import { LoadAccountByEmailRepository } from '../../protocols/db/users/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../protocols/db/users/update-access-token-repository'

export class DBAuthentication implements AuthenticationUseCase {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (
    authRequestEntity: AuthenticationRequestEntity
  ): Promise<AuthenticationResponseEntity> {
    const account = await this.loadAccountByEmailRepository.load({
      email: authRequestEntity.email
    })
    if (account) {
      const isValid = await this.hashComparer.compare(
        authRequestEntity.password,
        account.password
      )
      if (isValid) {
        const token = await this.encrypter.generate(account.id)
        await this.updateAccessTokenRepository.update({
          id: account.id,
          accessToken: token
        })
        const responseEntity: AuthenticationResponseEntity = {
          accessToken: token
        }
        return responseEntity
      }
    }
    return null
  }
}
