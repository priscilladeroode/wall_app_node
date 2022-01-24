import faker from 'faker'

import { AddAccountRepository } from '@/data/protocols/db/users/add-account-repository'
import {
  AddAccountRequestModel,
  AddAccountResponseModel,
  CheckAccountRequestModel,
  CheckAccountResponseModel,
  LoadAccountByTokenRequestModel,
  LoadAccountByTokenResponseModel,
  LoadAccountRequestModel,
  LoadAccountResponseModel
} from '@/data/models/users'
import { CheckAccountByEmailRepository } from '@/data/protocols/db/users/check-account-by-email-repository'
import { SendWelcomeEmailRepository } from '@/data/protocols/services/send-welcome-email-repository'
import { SendWelcomeEmailRequestModel } from '../models/services/send-welcome-email-request-model'
import { UpdateAccessTokenRepository } from '../protocols/db/users/update-access-token-repository'
import { LoadAccountByEmailRepository } from '../protocols/db/users/load-account-by-email-repository'
import { UpdateAccessTokenRequestModel } from '../models/users/update-access-token-request-model'
import { LoadAccountByTokenRepository } from '../protocols/db/users/load-account-by-token-repository'

export class AddAccountRepositorySpy implements AddAccountRepository {
  params: AddAccountRequestModel
  result = { registered: true }

  async add (
    accountData: AddAccountRequestModel
  ): Promise<AddAccountResponseModel> {
    this.params = accountData
    return this.result
  }
}

export class CheckAccountByEmailRepositorySpy
implements CheckAccountByEmailRepository {
  params: CheckAccountRequestModel
  result = { exists: false }
  async checkByEmail (
    data: CheckAccountRequestModel
  ): Promise<CheckAccountResponseModel> {
    this.params = data
    return this.result
  }
}

export class SendWelcomeEmailRepositorySpy
implements SendWelcomeEmailRepository {
  params: SendWelcomeEmailRequestModel

  async send (model: SendWelcomeEmailRequestModel): Promise<void> {
    this.params = model
  }
}

export class LoadAccountByEmailRepositorySpy
implements LoadAccountByEmailRepository {
  params: LoadAccountRequestModel
  result = {
    id: faker.datatype.uuid(),
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  }

  async loadByEmail (
    accountData: LoadAccountRequestModel
  ): Promise<LoadAccountResponseModel> {
    this.params = accountData
    return this.result
  }
}

export class UpdateAccessTokenRepositorySpy
implements UpdateAccessTokenRepository {
  params: UpdateAccessTokenRequestModel

  async updateAccessToken (data: UpdateAccessTokenRequestModel): Promise<void> {
    this.params = data
  }
}

export class LoadAccountByTokenRepositorySpy
implements LoadAccountByTokenRepository {
  params: LoadAccountByTokenRequestModel
  result = {
    uid: 'any_id'
  }

  async loadByToken (
    model: LoadAccountByTokenRequestModel
  ): Promise<LoadAccountByTokenResponseModel> {
    this.params = model
    return this.result
  }
}
