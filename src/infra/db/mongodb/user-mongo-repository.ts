import { ObjectId } from 'mongodb'
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
import { UpdateAccessTokenRequestModel } from '@/data/models/users/update-access-token-request-model'
import { AddAccountRepository } from '@/data/protocols/db/users/add-account-repository'
import { CheckAccountByEmailRepository } from '@/data/protocols/db/users/check-account-by-email-repository'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/users/load-account-by-email-repository'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/users/load-account-by-token-repository'
import { UpdateAccessTokenRepository } from '@/data/protocols/db/users/update-access-token-repository'
import { MongoHelper } from '../../helpers/mongo-helper'

export class UserMongoRepository
implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository,
    CheckAccountByEmailRepository,
    LoadAccountByTokenRepository {
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

  async checkByEmail (
    data: CheckAccountRequestModel
  ): Promise<CheckAccountResponseModel> {
    const accountCollection = MongoHelper.getCollection('users')
    const account = await accountCollection.findOne(
      {
        email: data.email
      },
      {
        projection: {
          _id: 1
        }
      }
    )
    const exists: CheckAccountResponseModel = {
      exists: account !== null
    }
    return exists
  }

  async updateAccessToken (data: UpdateAccessTokenRequestModel): Promise<void> {
    const collection = MongoHelper.getCollection('users')
    await collection.updateOne(
      { _id: new ObjectId(data.id) },
      { $set: { accessToken: data.accessToken } }
    )
  }

  async loadByToken (
    model: LoadAccountByTokenRequestModel
  ): Promise<LoadAccountByTokenResponseModel> {
    const collection = MongoHelper.getCollection('users')
    const result = await collection.findOne(model, {
      projection: {
        _id: 1
      }
    })
    if (result) {
      const model: LoadAccountByTokenResponseModel = {
        uid: result._id.toHexString()
      }
      return model
    }
    return null
  }
}
