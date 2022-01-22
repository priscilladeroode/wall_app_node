import app from '../../../src/main/config/app'
import { MongoHelper } from '../../infra/helpers/mongo-helper'
import { Collection } from 'mongodb'

import faker from 'faker'
import request from 'supertest'

let collection: Collection

describe('SignUp Routes', () => {
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

  test('Should return a 201 on create post', async () => {
    await request(app)
      .post('/api/posts')
      .send({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(),
        uid: faker.datatype.uuid()
      })
      .expect(201)
  })
})
