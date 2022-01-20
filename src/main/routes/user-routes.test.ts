import request from 'supertest'
import app from '../../../src/main/config/app'
import { MongoHelper } from '../../infra/helpers/mongo-helper'
import faker from 'faker'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const collection = MongoHelper.getCollection('users')
    await collection.deleteMany({})
  })
  const password = faker.internet.password()

  test('Should return a message on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: password,
        passwordConfirmation: password
      })
      .expect(200)
  })
})
