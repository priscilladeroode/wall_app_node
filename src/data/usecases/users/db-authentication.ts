import {
  AuthenticationRequestEntity,
  AuthenticationResponseEntity
} from '../../../domain/entities/users'
import { AuthenticationUseCase } from '../../../domain/usecases/users/authentication-usecase'
import { LoadAccountByEmailRepository } from '../../protocols/db/users/load-account-by-email-repository'

export class DBAuthentication implements AuthenticationUseCase {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async auth (
    authRequestEntity: AuthenticationRequestEntity
  ): Promise<AuthenticationResponseEntity> {
    await this.loadAccountByEmailRepository.load({
      email: authRequestEntity.email
    })
    return null
  }
}
