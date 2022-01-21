import faker from 'faker'
import { Collection } from 'mongodb'
import {
  AddAccountRequestModel,
  LoadAccountRequestModel
} from '../../../data/models/users'
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
    expect(result.message).toBeTruthy()
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
})
