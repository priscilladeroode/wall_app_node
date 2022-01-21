import {
  AuthenticationRequestEntity,
  AuthenticationResponseEntity
} from '../../../domain/entities/users'
import { AuthenticationUseCase } from '../../../domain/usecases/users/authentication-usecase'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/db/users/load-account-by-email-repository'

export class DBAuthentication implements AuthenticationUseCase {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer
  ) {}

  async auth (
    authRequestEntity: AuthenticationRequestEntity
  ): Promise<AuthenticationResponseEntity> {
    const account = await this.loadAccountByEmailRepository.load({
      email: authRequestEntity.email
    })
    if (account) {
      await this.hashComparer.compare(
        authRequestEntity.password,
        account.password
      )
    }
    return null
  }
}
