import {
  AddAccountRequestModel,
  AddAccountResponseModel
} from '../../../data/models/users'
import { AddAccountRepository } from '../../../data/protocols/db/users/add-account-repository'
import { MongoHelper } from '../../helpers/mongo-helper'

export class UserMongoRepository implements AddAccountRepository {
  async add (
    accountData: AddAccountRequestModel
  ): Promise<AddAccountResponseModel> {
    const collection = MongoHelper.getCollection('users')
    await collection.insertOne(accountData)
    return { message: 'User successfully registered' }
  }
}
