import {
  AddAccountRequestEntity,
  AddAccountResponseEntity
} from '../../../domain/entities/users'
import { AddAccount } from '../../../domain/usecases/users'
import { Encrypter } from '../../protocols/cryptography/encrypter'
import { AddAccountRepository } from '../../protocols/db/users/add-account-repository'

export class DBAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (
    accountData: AddAccountRequestEntity
  ): Promise<AddAccountResponseEntity> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    const account = await this.addAccountRepository.add(
      Object.assign({}, accountData, { password: hashedPassword })
    )
    return account
  }
}
