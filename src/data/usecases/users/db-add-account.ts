import {
  AddAccountRequestEntity,
  AddAccountResponseEntity
} from '../../../domain/entities/users'
import { AddAccount } from '../../../domain/usecases/users'
import { Encrypter } from '../../protocols/cryptography/encrypter'

export class DBAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter) {}
  async add (
    account: AddAccountRequestEntity
  ): Promise<AddAccountResponseEntity> {
    await this.encrypter.encrypt(account.password)
    return await Promise.resolve(null)
  }
}
