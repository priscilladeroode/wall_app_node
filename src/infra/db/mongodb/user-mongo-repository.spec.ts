import faker from 'faker'
import { MongoHelper } from '../../helpers/mongo-helper'
import { UserMongoRepository } from './user-mongo-repository'

describe('User Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should return an account on success', async () => {
    const sut = new UserMongoRepository()
    const accountModel = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    }
    const result = await sut.add(accountModel)
    expect(result).toBeTruthy()
    expect(result.message).toBeTruthy()
  })
})
