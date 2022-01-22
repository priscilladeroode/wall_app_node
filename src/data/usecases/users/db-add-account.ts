import {
  AddAccountRequestEntity,
  AddAccountResponseEntity
} from '../../../domain/entities/users'
import { AddAccount } from '../../../domain/usecases/users'
import { Hasher } from '../../protocols/cryptography/hasher'
import { AddAccountRepository } from '../../protocols/db/users/add-account-repository'
import { CheckAccountByEmailRepository } from '../../protocols/db/users/check-account-by-email-repository'
import { SendWelcomeEmailRepository } from '../../protocols/services/send-welcome-email-repository'

export class DBAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly sendEmail: SendWelcomeEmailRepository,
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository
  ) {}

  async add (
    accountData: AddAccountRequestEntity
  ): Promise<AddAccountResponseEntity> {
    const check = await this.checkAccountByEmailRepository.checkByEmail({
      email: accountData.email
    })
    if (!check.exists) {
      const hashedPassword = await this.hasher.hash(accountData.password)
      const account = await this.addAccountRepository.add(
        Object.assign({}, accountData, { password: hashedPassword })
      )
      if (account.registered) {
        await this.sendEmail.send(accountData.email, accountData.name)
      }
      return account
    }

    const result: AddAccountResponseEntity = { registered: false }
    return result
  }
}
