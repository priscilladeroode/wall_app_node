import { ObjectId } from 'mongodb'
import {
  AddAccountRequestModel,
  AddAccountResponseModel,
  LoadAccountRequestModel,
  LoadAccountResponseModel
} from '../../../data/models/users'
import { UpdateAccessTokenRequestModel } from '../../../data/models/users/update-access-token-request-model'
import { AddAccountRepository } from '../../../data/protocols/db/users/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../data/protocols/db/users/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../../data/protocols/db/users/update-access-token-repository'
import { MongoHelper } from '../../helpers/mongo-helper'

export class UserMongoRepository
implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository {
  async add (
    accountData: AddAccountRequestModel
  ): Promise<AddAccountResponseModel> {
    const collection = MongoHelper.getCollection('users')
    await collection.insertOne(accountData)
    const result: AddAccountResponseModel = {
      registered: true
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

  async updateAccessToken (data: UpdateAccessTokenRequestModel): Promise<void> {
    const collection = MongoHelper.getCollection('users')
    await collection.updateOne(
      { _id: new ObjectId(data.id) },
      { $set: { accessToken: data.accessToken } }
    )
  }
}
