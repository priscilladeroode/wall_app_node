import {
  AddAccountRequestModel,
  AddAccountResponseModel,
  LoadAccountRequestModel,
  LoadAccountResponseModel
} from '../../../data/models/users'
import { AddAccountRepository } from '../../../data/protocols/db/users/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../data/protocols/db/users/load-account-by-email-repository'
import { MongoHelper } from '../../helpers/mongo-helper'

export class UserMongoRepository
implements AddAccountRepository, LoadAccountByEmailRepository {
  async add (
    accountData: AddAccountRequestModel
  ): Promise<AddAccountResponseModel> {
    const collection = MongoHelper.getCollection('users')
    await collection.insertOne(accountData)
    const result: AddAccountResponseModel = {
      message: 'User successfully registered'
    }
    return result
  }

  async loadByEmail (
    accountData: LoadAccountRequestModel
  ): Promise<LoadAccountResponseModel> {
    const collection = MongoHelper.getCollection('users')
    const account = await collection.findOne({ email: accountData.email })
    if (account) {
      const result: LoadAccountResponseModel = {
        id: account._id.toHexString(),
        name: account.name,
        email: account.email,
        password: account.password
      }
      return result
    }

    return null
  }
}
