import faker from 'faker'
import { Collection } from 'mongodb'
import {
  AddAccountRequestModel,
  CheckAccountRequestModel,
  LoadAccountByTokenRequestModel,
  LoadAccountRequestModel
} from '@/data/models/users'
import { UpdateAccessTokenRequestModel } from '@/data/models/users/update-access-token-request-model'
import { MongoHelper } from '@/infra/helpers/mongo-helper'
import { UserMongoRepository } from '@/infra/db/mongodb/user-mongo-repository'

const name = faker.name.findName()
const email = faker.internet.email()
const password = faker.internet.password()
const accessToken = faker.datatype.uuid()

const loadByEmailRequestModel: LoadAccountRequestModel = { email }

const checkByEmailRequestModel: CheckAccountRequestModel = { email }

const accountRequestModel: AddAccountRequestModel = { name, email, password }

const loadByTokenRequestModel: LoadAccountByTokenRequestModel = { accessToken }

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

  describe('AddAccountRepository', () => {
    test('Should return an account on add success', async () => {
      const sut = makeSut()
      const result = await sut.add(accountRequestModel)
      expect(result).toBeTruthy()
      expect(result.registered).toBeTruthy()
    })
  })

  describe('LoadAccountByEmailRepository', () => {
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
  })

  describe('UpdateAccessTokenRepository', () => {
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
  })

  describe('CheckAccountByEmailRepository', () => {
    test('Should return true when checkByEmail finds account', async () => {
      const sut = makeSut()
      await collection.insertOne(accountRequestModel)
      const result = await sut.checkByEmail(checkByEmailRequestModel)
      expect(result).toBeTruthy()
      expect(result.exists).toBe(true)
    })

    test('Should return false when checkByEmail finds no account', async () => {
      const sut = makeSut()
      const result = await sut.checkByEmail(checkByEmailRequestModel)
      expect(result.exists).toBeFalsy()
    })
  })

  describe('LoadAccountByTokenRepository', () => {
    test('Should return an id on loadByToken success', async () => {
      const sut = makeSut()
      await collection.insertOne({
        name,
        email,
        password,
        accessToken
      })
      const result = await sut.loadByToken(loadByTokenRequestModel)
      expect(result).toBeTruthy()
      expect(result.uid).toBeTruthy()
    })

    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut()
      const result = await sut.loadByToken(loadByTokenRequestModel)
      expect(result).toBeFalsy()
    })
  })
})
