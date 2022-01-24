import faker from 'faker'
import {
  AddAccountRequestEntity,
  AddAccountResponseEntity,
  AuthenticationRequestEntity,
  AuthenticationResponseEntity
} from '@/domain/entities/users'
import { AuthenticationUseCase } from '@/domain/usecases/users/authentication-usecase'
import { AddAccount } from '@/domain/usecases/users'

export class AuthenticationUseCaseSpy implements AuthenticationUseCase {
  params: AuthenticationRequestEntity
  result = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    accessToken: 'any_accessToken'
  }

  async auth (
    authRequestEntity: AuthenticationRequestEntity
  ): Promise<AuthenticationResponseEntity> {
    this.params = authRequestEntity
    return this.result
  }
}

export class AddAccountSpy implements AddAccount {
  params: AddAccountRequestEntity
  result = { registered: true }
  async add (
    account: AddAccountRequestEntity
  ): Promise<AddAccountResponseEntity> {
    this.params = account
    return this.result
  }
}
