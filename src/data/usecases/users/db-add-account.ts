import {
  AddAccountRequestEntity,
  AddAccountResponseEntity
} from '../../../domain/entities/users'
import { AddAccount } from '../../../domain/usecases/users'
import { Hasher } from '../../protocols/cryptography/hasher'
import { AddAccountRepository } from '../../protocols/db/users/add-account-repository'
import { SendWelcomeEmailRepository } from '../../protocols/services/send-welcome-email-repository'

export class DBAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly sendEmail: SendWelcomeEmailRepository
  ) {}

  async add (
    accountData: AddAccountRequestEntity
  ): Promise<AddAccountResponseEntity> {
    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add(
      Object.assign({}, accountData, { password: hashedPassword })
    )
    if (account) {
      await this.sendEmail.send(accountData.email, accountData.name)
    }
    return account
  }
}
