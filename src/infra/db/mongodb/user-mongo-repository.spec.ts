import faker from 'faker'
import { Collection } from 'mongodb'
import {
  AddAccountRequestModel,
  LoadAccountRequestModel
} from '../../../data/models/users'
import { UpdateAccessTokenRequestModel } from '../../../data/models/users/update-access-token-request-model'
import { MongoHelper } from '../../helpers/mongo-helper'
import { UserMongoRepository } from './user-mongo-repository'

const fakeName = faker.name.findName()
const fakeEmail = faker.internet.email()
const fakePassword = faker.internet.password()

const loadByEmailRequestModel: LoadAccountRequestModel = {
  email: fakeEmail
}

const accountRequestModel: AddAccountRequestModel = {
  name: fakeName,
  email: fakeEmail,
  password: fakePassword
}

const makeSut = (): UserMongoRepository => {
  return new UserMongoRepository()
}

let collection: Collection

describe('User Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    collection = MongoHelper.getCollection('users')
    await collection.deleteMany({})
  })

  test('Should return an account on add success', async () => {
    const sut = makeSut()
    const result = await sut.add(accountRequestModel)
    expect(result).toBeTruthy()
    expect(result.registered).toBeTruthy()
  })

  test('Should return an account on loadByEmail success', async () => {
    const sut = makeSut()
    await collection.insertOne(accountRequestModel)
    const result = await sut.loadByEmail(loadByEmailRequestModel)
    expect(result).toBeTruthy()
    expect(result.id).toBeTruthy()
    expect(result.name).toBe(accountRequestModel.name)
    expect(result.email).toBe(accountRequestModel.email)
    expect(result.password).toBe(accountRequestModel.password)
  })

  test('Should return null if loadByEmail fails', async () => {
    const sut = makeSut()
    const result = await sut.loadByEmail(loadByEmailRequestModel)
    expect(result).toBeFalsy()
  })

  test('Should update the account accessToken on success', async () => {
    const sut = makeSut()
    const account = await collection.insertOne(accountRequestModel)
    const updateAccessTokenRequestModel: UpdateAccessTokenRequestModel = {
      id: account.insertedId.toHexString(),
      accessToken: 'any_accessToken'
    }
    await sut.updateAccessToken(updateAccessTokenRequestModel)
    const result = await collection.findOne({
      email: accountRequestModel.email
    })
    expect(result).toBeTruthy()
    expect(result.accessToken).toBe(updateAccessTokenRequestModel.accessToken)
  })

  describe('CheckAccountByEmailRepository', () => {
    test('Should return true when checkByEmail finds account', async () => {
      const sut = makeSut()
      await collection.insertOne(accountRequestModel)
      const result = await sut.checkByEmail(loadByEmailRequestModel)
      expect(result).toBeTruthy()
      expect(result.exists).toBe(true)
    })

    test('Should return false when checkByEmail finds no account', async () => {
      const sut = makeSut()
      const result = await sut.checkByEmail(loadByEmailRequestModel)
      expect(result.exists).toBeFalsy()
    })
  })
})
