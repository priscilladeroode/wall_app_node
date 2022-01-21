import request from 'supertest'
import app from '../../../src/main/config/app'
import { MongoHelper } from '../../infra/helpers/mongo-helper'
import faker from 'faker'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

let collection: Collection

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
        email: faker.internet.email(),
        password: password,
        passwordConfirmation: password
      })
      .expect(200)
  })

  test('Should return 200 on signin success', async () => {
    const hashedPassword = await hash(password, 12)
    await collection.insertOne({
      name: faker.name.findName(),
      email: 'priscilla@gmail.com',
      password: hashedPassword
    })
    await request(app)
      .post('/api/signin')
      .send({
        email: 'priscilla@gmail.com',
        password: password
      })
      .expect(200)
  })
})
