import app from '../../../src/main/config/app'
import { MongoHelper } from '../../infra/helpers/mongo-helper'
import { Collection, ObjectId } from 'mongodb'

import faker from 'faker'
import request from 'supertest'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let postsCollection: Collection
let usersCollection: Collection

const password = faker.internet.password()
const email = faker.internet.email()
const name = faker.name.findName()

describe('Posts Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    postsCollection = MongoHelper.getCollection('posts')
    await postsCollection.deleteMany({})
    usersCollection = MongoHelper.getCollection('users')
    await usersCollection.deleteMany({})
  })

  test('Should return a 403 on create post without accessToken', async () => {
    await request(app)
      .post('/api/posts')
      .send({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs()
      })
      .expect(403)
  })

  test('Should return a 201 on create post', async () => {
    const hashedPassword = await hash(password, 12)
    const result = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword
    })
    const id = result.insertedId.toHexString()
    const accessToken = sign({ id }, env.jwtSecret)
    await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          accessToken
        }
      }
    )
    await request(app)
      .post('/api/posts')
      .set('x-access-token', accessToken)
      .send({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs()
      })
      .expect(201)
  })
})
