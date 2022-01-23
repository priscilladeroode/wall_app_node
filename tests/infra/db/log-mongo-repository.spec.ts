import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/helpers/mongo-helper'
import { LogMongoRepository } from '@/infra/db/mongodb/log-mongo-repository'

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository()
}
describe('LogMongoRepository', () => {
  let collection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    collection = MongoHelper.getCollection('error')
    await collection.deleteMany({})
  })
  test('Should create a log error on success', async () => {
    const sut = makeSut()
    await sut.log('any_error')
    const count = await collection.countDocuments()
    expect(count).toBe(1)
  })
})
