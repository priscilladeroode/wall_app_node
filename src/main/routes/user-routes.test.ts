import request from 'supertest'
import app from '../../../src/main/config/app'
import { MongoHelper } from '../../infra/helpers/mongo-helper'

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

  test('Should return a message on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'any_name',
        email: 'any_email',
        password: 'any_password@mail.com',
        passwordConfirmation: 'any_password@mail.com'
      })
      .expect(200)
  })
})
