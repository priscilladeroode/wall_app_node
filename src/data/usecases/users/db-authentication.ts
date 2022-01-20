import { AuthenticationUseCase } from '../../../domain/usecases/users/authentication-usecase'
import { AuthenticationResponseModel } from '../../models/users/authentication-reponse-model'
import { AuthenticationRequestModel } from '../../models/users/authentication-request-model'
import { LoadAccountByEmailRepository } from '../../protocols/db/users/load-account-by-email-repository'

export class DBAuthentication implements AuthenticationUseCase {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async auth (
    authRequestEntity: AuthenticationRequestModel
  ): Promise<AuthenticationResponseModel> {
    await this.loadAccountByEmailRepository.load({
      email: authRequestEntity.email
    })
    return null
  }
}
