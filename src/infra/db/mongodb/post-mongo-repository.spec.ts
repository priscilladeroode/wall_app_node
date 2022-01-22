import faker from 'faker'
import { Collection } from 'mongodb'
import { AddPostRequestModel } from '../../../data/models/posts'
import { MongoHelper } from '../../helpers/mongo-helper'
import { PostMongoRepository } from './post-mongo-repository'

const title = faker.lorem.sentence()
const content = faker.lorem.paragraphs()
const uid = faker.datatype.uuid()

const request: AddPostRequestModel = { title, content, uid }

const makeSut = (): PostMongoRepository => {
  return new PostMongoRepository()
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
    collection = MongoHelper.getCollection('posts')
    await collection.deleteMany({})
  })

  describe('add', () => {
    test('Should return an id on add success', async () => {
      const sut = makeSut()
      const result = await sut.add(request)
      expect(result).toBeTruthy()
      expect(result.id).toBeTruthy()
    })
  })
})
