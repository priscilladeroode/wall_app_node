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
let hashedPassword: string
let uid: string
let accessToken: string

const title = faker.lorem.sentence()
const content = faker.lorem.paragraphs()

const title2 = faker.lorem.sentence()
const content2 = faker.lorem.paragraphs()

describe('Posts Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    hashedPassword = await hash(password, 12)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    postsCollection = MongoHelper.getCollection('posts')
    await postsCollection.deleteMany({})
    usersCollection = MongoHelper.getCollection('users')
    await usersCollection.deleteMany({})
    const result = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword
    })
    accessToken = sign({ id: uid }, env.jwtSecret)
    uid = result.insertedId.toHexString()
    await usersCollection.updateOne(
      { _id: new ObjectId(uid) },
      {
        $set: {
          accessToken
        }
      }
    )
  })

  describe('/POST posts', () => {
    test('Should return a 403 on create post without accessToken', async () => {
      await request(app).post('/api/posts').send({ title, content }).expect(403)
    })

    test('Should return a 201 on create post', async () => {
      await request(app)
        .post('/api/posts')
        .set('x-access-token', accessToken)
        .send({ title, content })
        .expect(201)
    })
  })

  describe('/GET posts', () => {
    test('Should return a 200 on load all post', async () => {
      await postsCollection.insertOne({ title, content, uid })
      await request(app).get('/api/posts').expect(200)
    })
  })

  describe('/GET postsByUser', () => {
    test('Should return a 200 on load user post', async () => {
      await postsCollection.insertOne({ title, content, uid })
      await request(app).get('/api/postsByUser/id').expect(200)
    })
  })

  describe('/PUT post', () => {
    test('Should return a 200 on update', async () => {
      const postId = (
        await postsCollection.insertOne({ title, content, uid })
      ).insertedId.toHexString()
      await request(app)
        .put(`/api/posts/${postId}`)
        .set('x-access-token', accessToken)
        .send({
          title: title2,
          content: content2
        })
        .expect(200)
    })
  })

  describe('/DELETE deleteById', () => {
    test('Should return a 200 on delete', async () => {
      const id = (
        await postsCollection.insertOne({ title, content, uid })
      ).insertedId.toHexString()
      await request(app)
        .delete(`/api/deleteById/${id}`)
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
