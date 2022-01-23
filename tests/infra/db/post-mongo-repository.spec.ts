import faker from 'faker'
import { Collection, ObjectId } from 'mongodb'
import { AddPostRequestModel } from '@/data/models/posts'
import { MongoHelper } from '@/infra/helpers/mongo-helper'
import { PostMongoRepository } from '@/infra/db/mongodb/post-mongo-repository'

const title = faker.lorem.sentence()
const content = faker.lorem.paragraphs()
const uid = faker.datatype.uuid()

const title2 = faker.lorem.sentence()
const content2 = faker.lorem.paragraphs()

const name = faker.name.findName()
const email = faker.internet.email()
const password = faker.internet.password()
const accessToken = faker.datatype.uuid()

const name2 = faker.name.findName()
const email2 = faker.internet.email()
const password2 = faker.internet.password()
const accessToken2 = faker.datatype.uuid()

const request: AddPostRequestModel = { title, content, uid }

const makeSut = (): PostMongoRepository => {
  return new PostMongoRepository()
}

let postsCollection: Collection
let usersCollection: Collection

let listUserId: {
  [key: number]: ObjectId
}

describe('User Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    usersCollection = MongoHelper.getCollection('users')
    postsCollection = MongoHelper.getCollection('posts')
    const user1 = { name, email, password, accessToken }
    const user2 = {
      name: name2,
      email: email2,
      password: password2,
      accessToken: accessToken2
    }
    listUserId = (await usersCollection.insertMany([user1, user2])).insertedIds
  })

  afterAll(async () => {
    await usersCollection.deleteMany({})
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await postsCollection.deleteMany({})
  })

  describe('add', () => {
    test('Should return an id on add success', async () => {
      const sut = makeSut()
      const result = await sut.add(request)
      expect(result).toBeTruthy()
      expect(result.id).toBeTruthy()
    })
  })

  describe('loadAll', () => {
    test('Should return a list of posts on descending order on success', async () => {
      const sut = makeSut()
      const post1 = {
        title,
        content,
        uid: listUserId[0]
      }
      const post2 = {
        title: title2,
        content: content2,
        uid: listUserId[1]
      }
      const listPosts = await postsCollection.insertMany([post1, post2])

      const result = await sut.loadAll()
      expect(result).toBeTruthy()
      expect(result[0].id).toBeTruthy()
      expect(result[0].title).toBe(title2)
      expect(result[0].content).toBe(content2)
      expect(result[0].createdBy).toBe(name2)
      expect(result[0].createdAt).toStrictEqual(
        listPosts.insertedIds[1].getTimestamp()
      )
      expect(result[1].id).toBeTruthy()
      expect(result[1].title).toBe(title)
      expect(result[1].content).toBe(content)
      expect(result[1].createdBy).toBe(name)
      expect(result[1].createdAt).toStrictEqual(
        listPosts.insertedIds[0].getTimestamp()
      )
    })

    test('Should return an empty list if there is no post', async () => {
      const sut = makeSut()
      const result = await sut.loadAll()
      expect(result).toBeTruthy()
      expect(result).toStrictEqual([])
    })
  })

  describe('loadByUid', () => {
    test('Should return a list of posts of the user on descending order on success', async () => {
      const sut = makeSut()
      const post1 = { title, content, uid: listUserId[0] }
      const post2 = {
        title: title2,
        content: content2,
        uid: listUserId[1]
      }
      const listOfPosts = await postsCollection.insertMany([post1, post2])

      const result = await sut.loadByUid({ uid: post1.uid.toHexString() })
      expect(result).toBeTruthy()
      expect(result.length).toBe(1)
      expect(result[0].id).toBeTruthy()
      expect(result[0].title).toBe(title)
      expect(result[0].content).toBe(content)
      expect(result[0].createdBy).toBe(name)
      expect(result[0].createdAt).toStrictEqual(
        listOfPosts.insertedIds[0].getTimestamp()
      )
    })
    test('Should return an empty list if there is no post', async () => {
      const sut = makeSut()
      const user = { name, email, password, accessToken }
      const userId = await usersCollection.insertOne(user)
      const uid = userId.insertedId.toHexString()
      const result = await sut.loadByUid({ uid })
      expect(result).toBeTruthy()
      expect(result).toStrictEqual([])
    })
  })

  describe('loadById', () => {
    test('Should return a post on success', async () => {
      const sut = makeSut()
      const post = { title, content, uid: listUserId[0] }
      const inserted = await postsCollection.insertOne(post)
      const result = await sut.loadById(inserted.insertedId.toHexString())
      expect(result).toBeTruthy()
      expect(result.id).toBeTruthy()
      expect(result.title).toBe(title)
      expect(result.content).toBe(content)
      expect(result.createdBy).toBe(name)
      expect(result.createdAt).toStrictEqual(inserted.insertedId.getTimestamp())
    })

    test('Should return null if there is no post', async () => {
      const sut = makeSut()
      const id1 = listUserId[0].toHexString()
      const result = await sut.loadById(id1)
      expect(result).toBeNull()
    })
  })

  describe('checkById', () => {
    let postId: ObjectId
    let post: any
    beforeEach(async () => {
      post = { title, content, uid: listUserId[0] }
      postId = (await postsCollection.insertOne(post)).insertedId
    })

    afterEach(async () => {
      await postsCollection.deleteMany({})
    })
    test('Should return a post on success', async () => {
      const sut = makeSut()
      const result = await sut.checkById(postId.toHexString())
      expect(result).toBeTruthy()
      expect(result.id).toBeTruthy()
      expect(result.title).toBe(title)
      expect(result.content).toBe(content)
      expect(result.uid).toBeTruthy()
    })

    test('Should return null if there is no post', async () => {
      const sut = makeSut()
      const id1 = postId.toHexString()
      await postsCollection.deleteOne(post)
      const result = await sut.checkById(id1)
      expect(result).toBeNull()
    })
  })
  describe('update', () => {
    test('Should update a post on success', async () => {
      const sut = makeSut()
      const post = { title, content, uid: listUserId[0] }
      const inserted = (await postsCollection.insertOne(post)).insertedId
      const postUpdate = {
        id: inserted.toHexString(),
        title: title2,
        content: content2,
        uid: listUserId[0].toHexString()
      }
      await sut.update(postUpdate)
      const result = await postsCollection.findOne({ _id: inserted })
      expect(result).toBeTruthy()
      expect(result._id).toBeTruthy()
      expect(result.title).toBe(title2)
      expect(result.content).toBe(content2)
      expect(result.uid).toBeTruthy()
    })
  })

  describe('update', () => {
    test('Should update a post on success', async () => {
      const sut = makeSut()
      const post = { title, content, uid: listUserId[0] }
      const inserted = (await postsCollection.insertOne(post)).insertedId
      await sut.deleteById(inserted.toHexString())
      const result = await postsCollection.findOne({ _id: inserted })
      expect(result).toBeNull()
    })
  })
})
