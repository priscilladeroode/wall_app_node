import request from 'supertest'
import faker from 'faker'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

import app from '@/main/config/app'
import { MongoHelper } from '@/infra/helpers/mongo-helper'

let collection: Collection

jest.mock('axios', () => ({
  async post (): Promise<string> {
    return await Promise.resolve('')
  }
}))

const password = faker.internet.password()

describe('SignUp Routes', () => {
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

  test('Should return a 200 on signup success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: faker.name.findName(),
        email: 'any_email@gmail.com',
        password: password,
        passwordConfirmation: password
      })
      .expect(200)
  })

  test('Should return 200 on signin success', async () => {
    const hashedPassword = await hash(password, 12)
    await collection.insertOne({
      name: faker.name.findName(),
      email: 'any_email@gmail.com',
      password: hashedPassword
    })
    await request(app)
      .post('/api/signin')
      .send({
        email: 'any_email@gmail.com',
        password: password
      })
      .expect(200)
  })

  test('Should return 401 on signin when invalid credentials', async () => {
    await request(app)
      .post('/api/signin')
      .send({
        email: 'any_email@gmail.com',
        password: password
      })
      .expect(401)
  })
})
